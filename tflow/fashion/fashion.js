//Author: Ravi Saripalli
//1st Jun 2024

class fashion {

   constructor () {
	this.imgSize = 28 * 28 ;
	this.nL = 10 ; // number of labels
        this.nB = 64 ;
        this.epochs = 3 ;
        this.mdlFile = "localstorage://myModel" ;
        this.trnFile = "fashion/train.csv" ;
        this.tstFile = "fashion/test.csv" ;
   }

  async function getCSV (fname, nL, nB) {
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

    dataSet = await csvDataset.map (({xs, ys}) => {
       v = new Array (nL).fill(0) ;
       v [Object.values (ys)] = 1 ;   // one shot labelling
	     return ( {xs: Object.values (xs), ys: v} ) ; 
    }) ;

    return (  dataSet.batch (this.nB) ) ; 
  } // end getCSV


  function monitor (start) {
      return ( async function (epoch, logs) {
	       dt = performance.now() - start ;
	       console.log ("Epoch: " + epoch +
		     " Loss: " + logs.loss + "  delT: ", Math.round(dt) ); 
	       start = performance.now(); } ); 
  } // end of monitor

  async function train () {
    /* Train fashion images and test */

      this.model = tf.sequential ({
      layers: [ tf.layers.dense ({units: this.imgSize, inputShape: [this.imgSize]}), // input
		tf.layers.dense ({units: 520, activation: "relu"}),   // middle
		tf.layers.dense ({units: this.nL, activation: "softmax"})  // output
	      ]
     }); // end model

    //console.log ("Model Layers: \n", model.layers);
    //console.log ("Model Inputs  \n", model.inputs[0].shape);
    //console.log ("Model Outputs  \n", model.outputs[0].shape);

    // Let us train the model with data
    trnData =  await getCSV (this.trnFile, this.nL, this.nB) ; 
    const opt = tf.train.sgd (.01) ;
    model.compile ({optimizer: opt,  loss: "categoricalCrossentropy"}) ;

    start = performance.now() ;
    console.log ("Training Started \n") ;
    await model.fitDataset (trnData, 
      { batchSize: this.nB, 
	epochs:    this.epochs,
	callbacks: { 
	  onEpochEnd: monitor (start) }
       }) ; 
    console.log ("Training Ended \n") ;

    console.log ("Saving the Model \n") ;
    await model.save (this.mdlFile);
    console.log ("Saved the Model \n") ;
  } // end train

  async funtion reEval () {
    console.log ("Starting Evaluation \n") ;
    tstData =  await getCSV ("fashion/test.csv", nL, nB) ; 
    result = await model.evaluateDataset (tstData) ;

    console.log ("Evaluation Done \n") ;
    result.print (true) ;
  }// end of reEval 

}
