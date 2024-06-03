//Author: Ravi Saripalli
//1st Jun 2024

async function getData(fname) {
  const response = await fetch(fname);
  data = await response.json();
  x = [] ; y = [] ;
  await data.forEach ( (obj) => { 
    			    nLabels = 10 ;
                            v = new Array(nLabels).fill(0) ;
                            v[obj.label] = 1 ;
                            y.push (v) ;      //This is oneShot Labelling 
                            x.push (obj.image) 
                          } );

  data =  {imgs: x , lbls: y}  ;
  return ( data ) ;
} // end of getData


async function ex3() {
const   csvDataset = 
    await tf.data.csv ( "data/train.csv", 
       {hasHeader: true,
	columnConfigs: { "label" : { isLabel: true } },
	delimWhitespace: false
	} );
  console.log (csvDataset) ;
  dataSet = csvDataset.map ( ({xs, ys}) => {
               return ( { xs:Object.values(xs),
	                  ys:Object.values(ys) } ) ; 
                } ).batch (20) ;
  console.log(await dataSet.toArray()) ;

}

async function ex33() {
  /* Train fashion images and test */

  imgSize = 28 * 28 ;
  nLabels = 10 ;
  bSize   = 64 ;     // Divvy up data to this many batches

 const model = tf.sequential ({
    layers: [ tf.layers.dense ({units: imgSize, inputShape: [imgSize]}), // input
              tf.layers.dense ({units: 512, activation: "relu"}),   // middle
              tf.layers.dense ({units: nLabels, activation: "softmax"})  // output
            ]
  }); // end model


  console.log ("Model Layers: \n", model.layers);
  console.log ("Model Inputs  \n", model.inputs[0].shape);
  console.log ("Model Outputs  \n", model.outputs[0].shape);

  // Let us train the model with data
  trnData = await  getData("fashion/train.json") ; 
  x = tf.tensor2d (trnData.imgs) ;
  y = tf.tensor2d (trnData.lbls) ;

  const opt = tf.train.sgd (.01) ;
  model.compile ({optimizer: opt,  loss: "categoricalCrossentropy"}) ;

  await model.fit (x, y, { batchSize: bSize, 
	                   epochs:    3,
                           callbacks: {
                               onEpochEnd: async(epoch, logs) => {
                                                 console.log ("Epoch: " + epoch +
				                  " Loss: " + logs.loss); }
                          }});
 } // end of ex3
