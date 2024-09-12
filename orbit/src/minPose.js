//Author: Ravi Saripalli
//21st Aug 2024
/* 
 *  CNN model pose estimation with small images 28x28
 **/
import {upload, getFile} from "./util.js" ;

export class pose {
   constructor () {
     this.imgW = 28 ;
     this.imgH = 28 ;
     this.nCh = 1 ; // grey scale (channel)
     this.imgSize = this.imgW * this.imgH ;
     this.nL = 3 ; // number of outputs (Euler angles)
     this.bS = 10 ; // No. of samples in a batch
     this.dataSize = 100 ;  // 
     this.epochs = 10 ;
     this.trained = false ;   
     this.learnRate = .05 ;
     this.opt = tf.train.sgd (this.learnRate) ;
     this.loss="meanSquaredError" ;
     this.metrics=['mse'] ;
     this.trnDataDir = "/data/mini/trnSet" ;  // training Data Location
     this.tstDataDir = "/data/mini/tstSet" ; //  test Data Location
     this.tScale = 45 * Math.PI / 180 ;  // scaling target values
     this.sIndex = 0  ;   // Start index of keys (from which data is loaded)
     this.eIndex = -1 ;
     this.mdlFile = "http://localhost:3000/upload/cnnX" ;
   } // end constructor


  async setupModel () {
      // if already trained use  saved state
	if (this.trained) 
	   this.model = await tf.loadLayersModel (this.mdlFile + "/model.json") ;
        else this.cnnModel () ;
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
  } //setupModel
	
  cnnModel () {  // try convolutional model
    this.model = tf.sequential ({ 
       layers: [ 
	         tf.layers.inputLayer ({
		      inputShape: [this.imgW, this.imgH, this.nCh] }),
	         tf.layers.rescaling ({scale: 1.0/255}),

	        // First Pair
	         tf.layers.conv2d ({filters: 6, kernelSize: (3,3), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),
	         //tf.layers.batchNormalization (),  
	         tf.layers.maxPooling2d ({poolSize: (2, 2), strides: (2, 2),
		                          padding: 'valid', dataFormat: 'channelsLast' }),

                 // Second Pair
	         tf.layers.conv2d ({filters: 16, kernelSize: (3,3), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),
	         //tf.layers.batchNormalization (),  
	         tf.layers.maxPooling2d ({poolSize: (2, 2), strides: (2, 2),
		                          padding: 'valid', dataFormat: 'channelsLast' }),

	         // Last one with many filters
	         tf.layers.conv2d ({filters: 120, kernelSize: (3,3), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),

	         tf.layers.flatten(),  // need it before we go dense :)
		 tf.layers.dense ({units: 200, activation: "relu"}),   // middle
	        // tf.layers.batchNormalization (),  
		 tf.layers.dense ({units: 50, activation: "relu"}),   // middle
	        // tf.layers.batchNormalization (),  
		 tf.layers.dense ({units: this.nL, activation: "relu"})  // output
	       ] });
   } // end cnnModel


  async train () {
    /** Compile the model
     *  fit Model to training data set
     *  show progress of fit graphically
     *  save the fitted model
     */ 
    if (this.trained) { // pickup from where we left off
      console.log ("Picking model from saved state \n") ;
      this.model = await tf.loadLayersModel (this.mdlFile + "/model.json") ;
      this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
    }
   
    console.log ("Training Started \n") ;

    // Loading data in batches of "dataSize: because of low GPU memeory
    //  don't confuse this training batch size "bS"
    // Data set size is available through key file
    this.sIndex = 0 ; 
      let dSet =  (await this.loadData (this.trnDataDir)).batch (this.bS) ;
      while ( dSet != null ) {
	const surface = { name: 'trends', tab: 'Training' } ;
	await this.model.fitDataset (dSet, 
	  { batchSize: this.bS, 
	    epochs:    this.epochs,
	    callbacks: 
		tfvis.show.fitCallbacks (surface, ['loss'])    
	    }) ; 
	console.log ("Training Ended \n") ;
	this.trained = true ;

	console.log ("Saving the Model \n", this.mdlFile) ;
	await this.model.save (this.mdlFile);
	console.log ("Saved the Model \n") ;
	console.log ("with Index : ", this.sIndex, this.eIndex) ;
        dSet =  (await this.loadData (this.trnDataDir)).batch (this.bS) ; ;
    } // end of data
  } // end train

  async pred () { // Evaluate a Data set ... just get predicted and input
      this.model = await tf.loadLayersModel (this.mdlFile + "/model.json") ;
      this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;

      this.sIndex = 0 ; 
      let dSet =  await this.loadData (this.trnDataDir) ;
      while ( dSet != null ) {
	let ds = await dSet.toArray() ;
	let shape =  [1, this.imgW, this.imgH, this.nCh] ; 

	let predTable = [] ;
	for (let i = 0 ; i < ds.length ; i ++) {
	    let xs = tf.reshape (ds[i].xs, shape) ; 
	    let ys = ds[i].ys ;
	    let result = await this.model.predict (xs);
	    let yp = Array.from (await result.data()) ;
	    yp = yp.map ( (e) => e * this.tScale * 180 / Math.PI) ; // back to unscaled
	    ys = ys.map ( (e) => e * this.tScale * 180 / Math.PI) ; // back to unscaled
	    console.log ( {y: ys[0], yp: yp[0]},
			  {y: ys[1], yp: yp[1]},
			  {y: ys[2], yp: yp[2]} ) ;
	    predTable.push ({ys: ys, yp: yp}) ;
	  } // end samples
	upload (JSON.stringify(predTable), "predTable", true) ;
        dSet =  await this.loadData (this.trnDataDir) ;
      } // done with all data
  } // end Eval

async loadData (dir) {
  // Generate Tensorflow DataSet from images
  // and return it a dataset 
  // tScale : target Value scaling factor
  // sIndex:  pickup from sIndex of the key
  // dSize:   data items to choose

  // key JSON file contains image file to rotation seq. mapping
  let key = await getFile ( dir + "/key") ;  // key file to pick data 
  key = JSON.parse (key) ;  // to proper JSON object
  this.eIndex = Math.min (key.length, this.sIndex + this.dataSize) ;
  console.log ("Keys : ", key.length, this.sIndex, this.eIndex) ; 
  if (this.sIndex == this.eIndex) return (null) ;

  let items = [] ;
  for (let k = this.sIndex ; k < this.eIndex ; k++) {
	  const img = new Image () ;
	  img.src = dir + "/" + key[k].fname ;
	  await img.decode () ;
          let nch = 1 ;
          let x = tf.browser.fromPixels (img, nch) ; // pixel data
          let y = [key[k].x, key[k].y, key[k].z] ;  //rotation angles in radians 
          y = y.map ( (e) => e / this.tScale ) ;    // scaling Targets aswell
          items.push ( {xs: x , ys: y} ) ;
      }
   this.sIndex = this.eIndex ; // prepare for next batch
   return ( tf.data.array (items) ) ; // return tflow Dataset
} // end loadData

} // end of pose class
