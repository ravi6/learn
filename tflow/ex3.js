async function getTrainData() {
  const response = await fetch("fashion/train.json");
  data = await response.json();
  x = [] ; y = [] ;
  await data.forEach ( (obj) => { y.push (obj.label) ;
                            x.push (obj.image) 
                          } );

  data =  {imgs: x , lbls: y}  ;
  return ( data ) ;
}

async function ex3() {
  /* Train fashion images and test */

  imgSize = 28 * 28 ;
  nLabels = 10 ;
  bSize   = 64 ;     // Divvy up data to this many batches

  model = tf.sequential ({
    layers: [ tf.layers.dense ({units: imgSize, batchInputShape: [null, bSize]}), // input
              tf.layers.dense ({units: 512, activation: 'relu'}),   // middle
              tf.layers.dense ({units: nLabels, activation: 'softmax'})  // output
            ]
  }); // end model

  console.log (model.outputs[0].shape) ;
  console.log (model.layers);

  // Let us train the model with data
   trnData = await  getTrainData() ; 
  x = tf.tensor2d (trnData.imgs) ;
  lbls = tf.tensor2d (trnData.lbls, [60000, 1]) ;

  model.compile ( {optimzer: "sgd", 
                   loss: 'binaryCrossentropy'} );

  const h = await
       model.fit ( x, y, {batchSize: bSize, epochs: 3} );
  console.log ("Loss after Epoch " + i + ": "
                  + h.history.loss [0] ) 
}
