//Author: Ravi Saripalli
//1st Jun 2024
/* Explore classifier nn with
 * Train fashion images and test  
 * Explore simple dense layer model 
 * and CNN model concepts
 **/

class fashion {

   constructor () {
     this.cnn = false ;  // switch to use cnn model
     this.imgW = 28 ;
     this.imgH = 28 ;
     this.nCh = 1 ; // grey scale (channel)
     this.imgSize = 28 * 28 ;
     this.nL = 10 ; // number of labels
     this.bS = 60 ; // No. of samples in a batch
     this.dataSize = 600 ;
     this.epochs = 5 ;
     this.trnFile = "data/train.csv" ;
     this.tstFile = "data/test.csv" ;
     this.trained = false ;   
     this.learnRate = .01 ;
     this.opt = tf.train.sgd (this.learnRate) ;
     this.loss =  "categoricalCrossentropy" ;

    this.tags = [ "T-Shirt",  "Trouser",  "Pullover",
                  "Dress",    "Coat", 	  "Sandal",
                  "Shirt",    "Sneaker",  "Bag",
                  "Ankle Boo/1t" ] ;

   } // end constructor


  async setupModel (isCnn) {
        this.cnn =  isCnn ;

	if (isCnn) 
     	    this.mdlFile = "indexeddb://localhost:8000/cnnX" ;
        else 
     	    this.mdlFile = "indexeddb://localhost:8000/annX" ;

      // if already trained use  saved state
	if (this.trained) 
	   this.model = await tf.loadLayersModel (this.mdlFile) ;
        else {
  	   if (isCnn)  this.cnnModel () ;
	   else        this.annModel () ;
        }

    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;

	  
  } //setupModel
	
  annModel () {
     this.model = tf.sequential ({
       layers: [ tf.layers.dense ({units: this.imgSize, inputShape: [this.imgSize] }), // input
		tf.layers.dense ({units: 520, activation: "relu"}),   // middle
		tf.layers.dense ({units: this.nL, activation: "softmax"})  // output
	      ]
     }); // end model
  }

  cnnModel () {  // try convolutional model
    this.model = tf.sequential ({ 
       layers: [ 
	         tf.layers.inputLayer ({
		      inputShape: [this.imgW, this.imgH, this.nCh] }),
	         tf.layers.conv2d ({filters: 1, kernelSize: (3,3), stride: (1, 1),
		                     padding: 'valid', dataFormat: 'channelsLast',
		                     activation: "relu"}),
	         tf.layers.maxPooling2d ({poolSize: (2, 2), strides: (1, 1),
		                          padding: 'valid', dataFormat: 'channelsLast' }),
	         tf.layers.flatten(),  // need it before we go dense :)
		 tf.layers.dense ({units: 50, activation: "relu"}),   // middle
		 tf.layers.dense ({units: this.nL, activation: "softmax"})  // output
	       ] });
   } // end cnnModel


  async loadData () {
    // load training and test data
    console.log ("Loading fashion data \n") ;
    this.trnData =  await this.getCSV (this.trnFile, this.nL, this.bS) ; 
    this.tstData =  await this.getCSV (this.tstFile, this.nL, this.bS) ; 
    
    // Just for cnn model
    if (this.cnn) {  // using cnn model
      this.trnData = await this.reShape( this.trnData ) ; // xs = [bs, w, h, ch]
      this.tstData = await this.reShape( this.tstData ) ; // xs = [bs, w, h, ch]
    }
    console.log ("Loaded fashion data \n") ;
  } // end loadData

  async getCSV (fname, nL, bS) {
  /**
   * Get csv data of labelled objects
   * save labels in oneShot format
   * and split data into bS chunks
   * return dataSet
   * @param {integer} nL - number of lables
   * @param {number}  bS - number of Batches
   * @returns {object} tf.DataSet object
   */

    const csvDataset = 
      await tf.data.csv (fname, {
	hasHeader: true,
	columnConfigs:  {label: {isLabel: true} },
	delimWhitspace: true });

    var dataSet = await csvDataset.map (({xs, ys}) => {
       let v = new Array (nL).fill(0) ;
       v [Object.values (ys)] = 1 ;   // ones hot labelling
       // Scaling is a must to get convergence (tf.js won't do it for you)
       let xscaled = Object.values (xs).map ( (x) => {return x * (1.0/255)} ) ;
	     return ( {xs: xscaled, ys: v} ) ;// scaling image
    }).take(this.dataSize) ;
 
    return ( dataSet.batch (this.bS) ) ; 
  } // end getCSV


  async train () {
    /** Compile the model
     *  fit Model to training data set
     *  show progress of fit graphically
     *  save the fitted model
     */ 
    if (this.trained) { // pickup from where we left off
      console.log ("Picking model from saved state \n") ;
      this.model = await tf.loadLayersModel (this.mdlFile) ;
      this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
    }
   
    var start = performance.now() ;

    console.log ("Training Started \n") ;
    const surface = { name: 'trends', tab: 'Training' } ;

    await this.model.fitDataset (this.trnData, 
      { batchSize: this.bS, 
	epochs:    this.epochs,
	callbacks: 
	//  { onEpochEnd: this.epochLog (start),
         //   onBatchEnd: this.batchLog () }
  	    tfvis.show.fitCallbacks (surface, ['loss'])    
        }) ; 
    console.log ("Training Ended \n") ;
    this.trained = true ;

    console.log ("Saving the Model \n") ;
    await this.model.save (this.mdlFile);
    console.log ("Saved the Model \n") ;

  } // end train

  async Eval () { // Prints average loss on test data set

    this.model = await tf.loadLayersModel (this.mdlFile) ;
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;

    let result = await this.model.evaluateDataset (this.tstData) ;
    result = (await result.data())[0] ; 
    console.log("Evaluation Loss:  ", result);
	return (result) ;
  } // end of reEval 

  async visTest () {  
    // Grab one batch of data (unfortunately
    //    the batch size will be unalterable
    //    unless I reload data from file ... artifact of "ts.js"
    //    I pick about 10 items at random from it
    //    and make predictions with trained model
    //
    //
      let ds = await this.tstData.shuffle(2) ;
      ds = await ds.take(1) ; // just one batch is porcessed
      ds = await ds.toArray() ;
      let xs = await (await ds[0]).xs ;
      let ys = await (await ds[0]).ys ;
      xs = xs.arraySync() ;
      ys = ys.arraySync() ;

      // pick few random samples from the above batch 
      var tblData =  [] ;
      for (let i = 0 ; i < 10 ; i ++) {
	  let idx = Math.floor (Math.random () * this.bS);

	  // Make prediction with xs as input
	  let shape ;
	  if (this.cnn){  // single sample bS=1
	      shape = [1, this.imgW, this.imgH, this.nCh] ;
	  }
	  else { 
	      shape = [1, this.imgSize] ;
	  };

	  let result = await this.model.predict (tf.reshape (xs[idx], shape));
	  let yp = await result.data() ;
	  let tp = this.getTag(yp) ;
	  let tt = this.getTag(ys[idx]) ;
	  console.log ("Actual: ", tt, 
	      "\t\tpredicted: ",  tp) ; 
          tblData.push ([i, tt, tp]) ;
	}

      const headers = ['sample', 'predicted', 'actual'  ];
      const surface = { name: 'Predictions', tab: 'Charts' };
      tfvis.render.table(surface, { headers, values:tblData });

  } // end visTest

  getTag (y) { // returns category tag give output
	return ( this.tags [y.indexOf 
	   (Math.max.apply (null, y))] );
  }

  async reShape (ds) { // reshaping existing data for cnn
     let z = await ds.toArray() ;
     z.forEach ( (obj) => {
           obj.xs = tf.reshape (obj.xs, 
				[this.bS, this.imgW, this.imgH, this.nCh]) ;
           return(obj) ;
     } ) ;
    return (tf.data.array(z)) ;
  }

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

} // end of fashion class
