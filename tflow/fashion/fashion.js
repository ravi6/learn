//Author: Ravi Saripalli
//1st Jun 2024
/* Explore classifier nn with
 * Train fashion images and test */

class fashion {

   constructor () {
     this.imgSize = 28 * 28 ;
     this.nL = 10 ; // number of labels
     this.nB = 3 ;
     this.epochs = 3 ;
     this.mdlFile = "localstorage://myModel" ;
     this.trnFile = "data/train.csv" ;
     this.tstFile = "data/test.csv" ;
     this.trained = false ;   
     this.learnRate = 0.01 ;

     this.model = tf.sequential ({
     layers: [ tf.layers.dense ({units: this.imgSize, inputShape: [this.imgSize]}), // input
		tf.layers.dense ({units: 50, activation: "relu"}),   // middle
		tf.layers.dense ({units: this.nL, activation: "softmax"})  // output
	      ]
     }); // end model

    console.log ("Model Layers: \n", this.model.layers);
    console.log ("Model Inputs  \n", this.model.inputs[0].shape);
    console.log ("Model Outputs  \n", this.model.outputs[0].shape);

   } // end constructor

  async run () {
      await this.loadData () ;
      await this.train () ;
      this.Eval () ;
      
  }

  async loadData () {
    // load training and test data
    console.log ("Loading fashion data \n") ;
    this.trnData =  await this.getCSV (this.trnFile, this.nL, this.nB) ; 
    this.tstData =  await this.getCSV (this.tstFile, this.nL, this.nB) ; 
    console.log ("Loaded fashion data \n") ;
  } // end loadData

  async getCSV (fname, nL, nB) {
  /**
   * Get csv data of labelled objects
   * save labels in oneShot format
   * and split data into nB chunks
   * return dataSet
   * @param {integer} nL - number of lables
   * @param {number}  nB - number of Batches
   * @returns {object} tf.DataSet object
   */

    const csvDataset = 
      await tf.data.csv (fname, {
	hasHeader: true,
	columnConfigs:  {label: {isLabel: true} },
	delimWhitspace: true });
    console.log(fname) ;
    var dataSet = await csvDataset.map (({xs, ys}) => {
       var v = new Array (nL).fill(0) ;
       v [Object.values (ys)] = 1 ;   // one shot labelling
	     return ( {xs: Object.values (xs), ys: v} ) ; 
    }) ;

    return (  dataSet.batch (this.nB) ) ; 
  } // end getCSV


  epochLog (start) { 
    // returns callback fn to execute at end of epoch
      return ( async function (epoch, logs) {
	              dt = performance.now() - start ;
	              console.log ("Epoch: " + epoch +
		           " Loss: " + logs.loss + "  delT: ", Math.round(dt) ); 
                      start = performance.now() ; } );  //  retart cpu timer
  } // end of epochLog


  async train () {

    // Let us train the model with data
    const opt = tf.train.sgd (.01) ;
    this.model.compile ({optimizer: opt,  loss: "categoricalCrossentropy"}) ;
    var start = performance.now() ;

    console.log ("Training Started \n") ;
    await this.model.fitDataset (this.trnData, 
      { batchSize: this.nB, 
	epochs:    this.epochs,
	callbacks: { 
	  onEpochEnd: this.epochLog (start) ,
	  onBatchEnd: function (batch, logs) {
	       console.log (batch) ; 
	       }
        }}) ; 
    console.log ("Training Ended \n") ;
    this.trained = true ;

    console.log ("Saving the Model \n") ;
    await this.model.save (this.mdlFile);
    console.log ("Saved the Model \n") ;

  } // end train

  async Eval () {
    console.log ("Starting Evaluation \n") ;
    result = await this.model.evaluateDataset (tstData) ;

    console.log ("Evaluation Done \n") ;
    result.print (true) ;
  } // end of reEval 

} // end of fashion class
