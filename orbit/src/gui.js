// Author: Ravi Saripalli
// Place for all GUI interaction Code
//  Fashion object instantiation

f = new pose () ;  
f.trained = document.getElementById ("cbTrained").checked ;
f.setupModel (isCnn) ;  // startup setup

let loggerD = document.getElementById("logger");

// All of this just to print Model Summary
      let btnSum = document.getElementById ("btnSum");
      function modSum (msg) { logger (msg); } // end modSum
      function doit () {
	   logger ("<<<<<<<<<<<  Model Summary  >>>>>>>>>>*") ;
           f.model.summary ( 50, [0.5, 0.75, 1], printFn = modSum ) ;
	   logger ("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>")  ;
      }
      btnSum.addEventListener ( "click", doit);                                            
      btnSum.click();

//let tvis = tfvis.visor() ;
//tvis.open() ;     

let imgNet = document.getElementById ("imgNet") ;
imgNet.src = "images/cnn.png" ; 

logger("Setup CNN Model") ; 
await f.setupModel ();
logger("Model File:  " + f.mdlFile);
btnSum.click() ;


// Train , Eval and Predict button actions
let btnTrain = document.getElementById ("btnTrain");
btnTrain.addEventListener ( "click",  Train() ) ; 
function Train () {
      return async function (e)  {  
         logger ("Started Training");
         btnTrain.disabled = true ;
         btnTrain.innerText = "Training";
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