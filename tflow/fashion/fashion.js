//Author: Ravi Saripalli
//1st Jun 2024
/* Explore classifier nn with
 * Train fashion images and test  
 **/

class fashion {

   constructor () {
     this.imgSize = 28 * 28 ;
     this.nL = 10 ; // number of labels
     this.bS = 64 ; // No. of samples in a batch
     this.dataSize = 600 ;
     this.epochs = 2 ;
     this.mdlFile = "indexeddb://localhost:8000/myModel" ;
     this.trnFile = "data/big/train.csv" ;
     this.tstFile = "data/big/test.csv" ;
     this.trained = false ;   
     this.learnRate = .01 ;
     this.opt = tf.train.sgd (this.learnRate) ;
     this.loss =  "categoricalCrossentropy" ;

     this.model = tf.sequential ({
       layers: [ tf.layers.dense ({units: this.imgSize, inputShape: [this.imgSize] }), // input
		tf.layers.dense ({units: 520, activation: "relu"}),   // middle
		tf.layers.dense ({units: this.nL, activation: "softmax"})  // output
	      ]
     }); // end model

    this.tags = [ "T-Shirt",  "Trouser",  "Pullover",
             "Dress",  "Coat",  "Sandal",
             "Shirt",  "Sneaker",  "Bag",
             "Ankle Boot" ] ;

    console.log ("Model Layers: \n", this.model.layers);
    console.log ("Model Inputs  \n", this.model.inputs[0].shape);
    console.log ("Model Outputs  \n", this.model.outputs[0].shape);

   } // end constructor

  async run () {
      
      let tvis = tfvis.visor() ;
      tvis.open() ;
      await this.loadData () ;
      
      this.trained = false ;
      await this.train () ;
      await this.Eval() ;
      await this.visTest() ;
      
  }

  async loadData () {
    // load training and test data
    console.log ("Loading fashion data \n") ;
    this.trnData =  await this.getCSV (this.trnFile, this.nL, this.bS) ; 
    this.tstData =  await this.getCSV (this.tstFile, this.nL, this.bS) ; 
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

  async train () {
    /** Compile the model
     *  fit Model to training data set
     *  show progress of fit graphically
     *  save the fitted model
     */ 
    this.model.summary() ; 
    if (this.trained) { // pickup from where we left off
      console.log ("Picking model from saved state \n") ;
      this.model = await tf.loadLayersModel (this.mdlFile) ;
    }
   
    // Let us train the model with data
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
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
    await this.loadData () ; // Reload data with batch size of 1

    let result = await this.model.evaluateDataset (this.tstData) ;
    result = (await result.data())[0] ; 
    console.log("Evaluation Loss:  ", result);
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
	  let xp = await tf.tensor2d (xs[idx], [1, this.imgSize]) ;
	  let result = await this.model.predict (xp);
	  let yp = await result.data() ;
	  let tp = this.getTag(yp) ;
	  let tt = this.getTag(ys[idx]) ;
	  console.log ("Actual: ", tt, 
	      "\t\tpredicted: ",  tp) ; 
          tblData.push ([i, tt, tp]) ;
	}
       console.log(tblData) ;

      const headers = ['sample', 'predicted', 'actual'  ];
      const surface = { name: 'Predictions', tab: 'Charts' };
      tfvis.render.table(surface, { headers, values:tblData });

  } // end visTest

  getTag (y) { // returns category tag give output
	return ( this.tags [y.indexOf 
	   (Math.max.apply (null, y))] );
  }

} // end of fashion class
