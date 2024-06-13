// Place for all GUI interaction Code

f = new fashion () ;  
      //let tvis = tfvis.visor() ;
      //tvis.open() ;
      f.trained = document.getElementById ("cbTrained").checked ;
      
      //(function () { // what a way to call async funcs from html
      //  return (async function () {await f.loadData()} );
      //})()();
    
      
    let btnTrain = document.getElementById ("btnTrain");
      btnTrain.addEventListener ( "click",  Train() ) ; 
      function Train () {
            return async function (e)  {             
               btnTrain.disabled = true ;
               btnTrain.innerText = "Training";
               f.simpleModel () ;  // make model
               await f.train () ;
               btnTrain.innerText = "Train" ;
               btnTrain.disabled = false;       
      }} ;

    let btnEval = document.getElementById ("btnEval");
      btnEval.addEventListener ( "click",  Eval() ) ;   
      function Eval () {
            return async function (e)  {            
               btnEval.disabled = true ;
               btnEval.innerText = "Evaluating";
               await f.Eval () ;
               btnEval.innerText = "Eval";
               btnEval.disabled = false;       
      }} ;

      let btnData = document.getElementById ("btnData");
      btnData.addEventListener ( "click",  getData() ) ; 
      function getData () {
            return async function (e)  {             
               btnData.disabled = true;
               btnData.innerText= "Loading";
               await f.loadData () ;
               btnData.innerText = "getData" ;
               btnData.disabled = false;       
      }} ;

      let btnPred = document.getElementById ("btnPred");
      btnPred.addEventListener ( "click",  predict() ) ; 
      function predict () {
            return async function (e)  {             
               await f.visTest () ;
            }};