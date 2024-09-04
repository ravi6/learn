//Author: Ravi Saripalli
//21st Aug 2024
/* 
 *  CNN model in Anger
 **/
import {upload, getFile} from "./util.js" ;

export class pose {

   constructor () {
     this.imgW = 115 ;
     this.imgH = 115 ;
     this.nCh = 1 ; // grey scale (channel)
     this.imgSize = this.imgW * this.imgH ;
     this.nL = 3 ; // number of outputs (Euler angles)
     this.bS = 10 ; // No. of samples in a batch
     this.dataSize = 1000 ;
     this.epochs = 5 ;
     this.trained = false ;   
     this.learnRate = .05 ;
     this.opt = tf.train.sgd (this.learnRate) ;
     this.loss="meanSquaredError" ;
     this.metrics=['mse'] ;
     this.trnData = null ;  // training Data
     this.tstData = null ; //  test Data
     this.tScale = 45 * Math.PI / 180 ;  // scaling target values
     this.sIndex = 0 ;   // Start index of keys (from which data is loaded)
     this.eIndex = 0 ;
   } // end constructor


  async setupModel () {
     	     this.mdlFile = "http://localhost:3000/upload/cnnX" ;
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
	         tf.layers.conv2d ({filters: 6, kernelSize: (15,15), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),
	         tf.layers.batchNormalization (),  
	         tf.layers.maxPooling2d ({poolSize: (2, 2), strides: (2, 2),
		                          padding: 'valid', dataFormat: 'channelsLast' }),

                 // Second Pair
	         tf.layers.conv2d ({filters: 16, kernelSize: (15,15), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),
	         tf.layers.batchNormalization (),  
	         tf.layers.maxPooling2d ({poolSize: (2, 2), strides: (2, 2),
		                          padding: 'valid', dataFormat: 'channelsLast' }),

	         // Last one with many filters
	         tf.layers.conv2d ({filters: 120, kernelSize: (15,15), stride: (2, 2),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),

	         tf.layers.flatten(),  // need it before we go dense :)
		 tf.layers.dense ({units: 200, activation: "relu"}),   // middle
	         tf.layers.batchNormalization (),  
		 tf.layers.dense ({units: 50, activation: "relu"}),   // middle
	         tf.layers.batchNormalization (),  
		 tf.layers.dense ({units: this.nL, activation: "relu"})  // output
	       ] });
   } // end cnnModel


  async getData ()  {  // need to fixthis up later
     // training and test data
     console.log ("Loading pose training data \n") ;
     let ds  = await this.loadData ("/output/big") ;
     this.trnData = (ds.take (this.dataSize)).batch (this.bS) ; // grab a subset in chunks of bS
     console.log ("Loading pose test data \n") ;
     this.tstData = await this.loadData ("/output/fine/tstSet", this.tScale) ; // We take everything 
  } // end loadData


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
   
    var start = performance.now() ;

    console.log ("Training Started \n") ;
    const surface = { name: 'trends', tab: 'Training' } ;
    await this.model.fitDataset (this.trnData, 
      { batchSize: this.bS, 
	epochs:    this.epochs,
	callbacks: 
	//{onEpochEnd: this.epochLog (start),
	//onBatchEnd: this.batchLog ()}
  	    tfvis.show.fitCallbacks (surface, ['loss'])    
        }) ; 
    console.log ("Training Ended \n") ;
    this.trained = true ;
    console.log ("Saving the Model \n", this.mdlFile) ;
    await this.model.save (this.mdlFile);
    console.log ("Saved the Model \n") ;
    console.log ("with Index : ", this.sIndex, this.eIndex) ;
    this.sIndex = this.eIndex  ;  // next 
  } // end train

  async Eval () { // Prints average loss on test data set

    this.model = await tf.loadLayersModel (this.mdlFile + "/model.json") ;
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
    let result = await this.model.evaluateDataset (await this.tstData.batch(this.bS)) ;
    result = (await result.data()) ; 
    console.log("Evaluation Loss:  ", result[0]);
	return (result[0]) ;
  } // end of reEval 

  async visTest () { // Downloads prediction vs expected in a JSON table  
      this.model = await tf.loadLayersModel (this.mdlFile + "/model.json") ;
      this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
      let ds = await this.tstData.toArray() ;
      let shape =  [1, this.imgW, this.imgH, this.nCh] ; 
      // pick few random samples from the above batch 
      let table = [] ;
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
	  table.push ({ys: ys, yp: yp}) ;
	} // end samples

        upload (JSON.stringify (table), "pred", true) ;
    /*
      const headers = ['sample', 'predicted', 'actual'  ];
      const surface = { name: 'Predictions', tab: 'Charts' };
      tfvis.render.table(surface, { headers, values:tblData });
      */

  } // end visTest

  epochLog (start) { 
    // returns callback fn to execute at end of epoch
      return ( async function (epoch, logs) {
	              let dt = performance.now() - start ;
	              console.log ("Epoch: " + epoch +
		           " Loss: " + logs.loss + "  delT: ", Math.round(dt) ); 
                      start = performance.now() ; //  retart cpu timer
              }); 
  } // end of epochLog

  batchLog () { 
    // returns callback fn to execute at end of batch
      return ( async function (batch, logs) {
	              console.log ("Batch: " + batch +
		           " Loss: " + logs.loss ) ;
                     }); 
  } // end of batchLog

async loadData (dir) {
  // Generate Tensorflow DataSet from images
  // and return it a dataset 
  // tScale : target Value scaling factor
  // sIndex:  pickup from sIndex of the key
  // dSize:   data items to choose

  const items = [] ;
  // key JSON file contains image file to rotation seq. mapping
  let key = await getFile ( dir + "/keyshuf") ;  // use shuffled keyfile 
  key = JSON.parse (key) ;  // to proper JSON object
  this.eIndex = Math.min (key.length, this.sIndex + this.dataSize) ;
  console.log ("Keys : ", key.length, this.sIndex, this.eIndex) ; 
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
   return ( tf.data.array (items) ) ; // return tflow Dataset
} // end loadData

} // end of pose class
