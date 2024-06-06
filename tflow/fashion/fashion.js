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
     this.epochs = 5 ;
     this.mdlFile = "indexeddb://localhost:8000/myModel" ;
     this.trnFile = "data/big/train.csv" ;
     this.tstFile = "data/big/test.csv" ;
     this.trained = false ;   
     this.learnRate = 0.01 ;
     this.opt = tf.train.sgd (.01) ;
     this.loss =  "categoricalCrossentropy" ;

     this.model = tf.sequential ({
     layers: [ tf.layers.dense ({units: this.imgSize, inputShape: [this.imgSize]}), // input
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
      
      await this.Eval() ;
      return ;
      let tvis = tfvis.visor() ;
      tvis.open() ;
      await this.loadData () ;
      
      this.trained = true ;
      for (let i = 0 ; i <5 ; i++) {
	await this.train () ;
	this.Eval () ;
      }
      
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
       var v = new Array (nL).fill(0) ;
       v [Object.values (ys)] = 1 ;   // one shot labelling
	     return ( {xs: Object.values (xs), ys: v} ) ; 
    }) ;

    return (  dataSet.batch (this.bS) ) ; 
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

  batchLog (obj) { 
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
     
    if (this.trained) { // pickup from where we left off
      console.log ("Picking model from saved state \n") ;
      this.model = await tf.loadLayersModel (this.mdlFile) ;
    }
   
    // Let us train the model with data
    this.opt = tf.train.sgd (.01) ;
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;
    var start = performance.now() ;

    console.log ("Training Started \n") ;
    const surface = { name: 'trends', tab: 'Training' } ;

	  console.log( tfvis.show.fitCallbacks (surface, ['loss']) );    
    await this.model.fitDataset (this.trnData, 
      { batchSize: this.bS, 
	epochs:    this.epochs,
	callbacks: 
	//  { onEpochEnd: this.epochLog (start),
        //    obSatchEnd: this.batchLog (this) }
  	    tfvis.show.fitCallbacks (surface, ['loss'])    
        }) ; 
    console.log ("Training Ended \n") ;
    this.trained = true ;

    console.log ("Saving the Model \n") ;
    await this.model.save (this.mdlFile);
    console.log ("Saved the Model \n") ;

  } // end train

  async Eval (canvas) {

    console.log ("Starting Evaluation \n") ;
    let result = await this.model.evaluateDataset (tstData) ;
    result = (await result.data())[0] ; 
    console.log("Evaluation Loss:  ", result);
    console.log ("Evaluation Done \n");

  } // end of reEval 

  visTest () {  // Random visual test on 9 samples
    this.bS = 1 ;
    this.model = await tf.loadLayersModel (this.mdlFile) ;
    this.model.compile ({optimizer: this.opt,  loss: this.loss}) ;

    await this.loadData () ; // Reload data with batch size of 1
    var tstData = await (this.tstData.shuffle(100).take(9));
    var xs = await (await tstData.toArray())[3].xs.data() ;
    var ys = await (await tstData.toArray())[3].ys.data() ;

    array.indexOf(Math.max.apply(null, array)



  }
} // end of fashion class
