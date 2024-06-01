function ex2() {
  /* Explore  configuring network layers
     Try sequential with progressive addition of
     layers
  */
  model = tf.sequential ();
  // Input Layer
  model.add (tf.layers.dense (
     {units: 32, 
      batchInputShape: [null, 50]})) ;
  // Output Layer?
  model.add (tf.layers.dense ({units: 4})) ;
  console.log (JSON.stringify (model.outputs[0].shape));
  console.log (model.outputs);


  // Alternate way of doing above
  model = tf.sequential ({
    layers: [ tf.layers.dense (
                {units: 32, 
                 batchInputShape: [null, 50]}),
              tf.layers.dense ( {units: 4} )
            ] 
  });
  console.log (JSON.stringify (model.outputs[0].shape));
  console.log(model) ;


  // Let us now create input(size 5) + two layers of sizes (10 and 4)
  // with some nonlinear stuff
  model = tf.sequential ({
    layers: [ tf.layers.dense ({units: 5, inputShape: [5]}), // input
              tf.layers.dense ({units: 10, activation: 'relu'}),   // middle
              tf.layers.dense ({units: 4, activation: 'softmax'})  // output
            ]
  }); // end model
  //console.log (JSON.stringify (model.outputs));
  console.log(model.outputs[0].shape) ;
  console.log(model.layers);
  // Why inputShape is not same as input here ??
  // looks like it wants one additional dimension
  model.predict ( tf.ones([1,5]) ).print(); // note input is row vector of size 5
}


