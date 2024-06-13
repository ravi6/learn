// Place for all GUI interaction Code
let loggerD = document.getElementById("logger");

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
               logger ("Started Training");
               btnTrain.disabled = true ;
               btnTrain.innerText = "Training";
               f.simpleModel () ;  // make model
               await f.train () ;
               btnTrain.innerText = "Train" ;
               btnTrain.disabled = false;  
               logger ("Training Ended");
      }} ;

    let btnEval = document.getElementById ("btnEval");
      btnEval.addEventListener ( "click",  Eval() ) ;   
      function Eval () {
            return async function (e)  {  
               logger ("Evaluation Started");
               btnEval.disabled = true ;
               btnEval.innerText = "Evaluating";
               result = await f.Eval () ;
               btnEval.innerText = "Eval";
               btnEval.disabled = false;  
               logger ("Evaluation Loss = " + result);
      }} ;

      let btnData = document.getElementById ("btnData");
      btnData.addEventListener ( "click",  getData() ) ; 
      function getData () {
            return async function (e)  { 
               logger ("Loading Data");
               btnData.disabled = true;
               btnData.innerText= "Loading";
               await f.loadData () ;
               btnData.innerText = "getData" ;
               btnData.disabled = false; 
               logger ("Loaded Data");
      }} ;

      let btnPred = document.getElementById ("btnPred");
      btnPred.addEventListener ( "click",  predict() ) ; 
      function predict () {
            return async function (e)  {             
               await f.visTest () ;
            }};

      function logger (msg) {
            let  ccc = document.createElement("span");
            let tim = new Date().toLocaleTimeString('en-US', { hour12: false, 
                                             hour: "numeric", 
                                             minute: "numeric",
                                             second: "numeric"});
            ccc.innerText = tim + ":>   " + msg + "\n";
            loggerD.appendChild(ccc);
            loggerD.scrollTop = loggerD.scrollHeight ;
     }