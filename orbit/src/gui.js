// Author: Ravi Saripalli
// Place for all GUI interaction Code
//  Fashion object instantiation
import {pose} from "./pose.js"
import {upload, getFile} from "./util.js" ;

let loggerD = document.getElementById("logger");
let imgNet = document.getElementById ("imgNet") ;
imgNet.src = "imgs/cnn.png" ; 

let f = new pose () ;  
f.trained = document.getElementById ("cbTrained").checked ;
logger("Setup CNN Model") ; 
await f.setupModel () ;  // startup setup
logger("Model File:  " + f.mdlFile);

// All of this just to print Model Summary
      let btnSum = document.getElementById ("btnSum");
      function modSum (msg) { logger (msg); } // end modSum
      function doit () {
	   logger ("<<<<<<<<<<<  Model Summary  >>>>>>>>>>*") ;
	   f.model.summary() ;
           f.model.summary ( 50, [0.5, 0.75, 1],  modSum ) ;
	   logger ("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>")  ;
      }
      btnSum.addEventListener ( "click", doit);                                            
      btnSum.click();

//let tvis = tfvis.visor() ;
//tvis.open() ;     

// Train , Eval and Predict button actions
let btnTrain = document.getElementById ("btnTrain");
btnTrain.addEventListener ( "click",  Train() ) ; 
function Train () {
      return async function (e)  {  
         logger ("Started Training");
         btnTrain.disabled = true ;
         btnTrain.innerText = "Training";
	 f.learnRate = parseFloat (document.getElementById ("learnRate").value) ;
	 f.epochs = parseInt (document.getElementById ("epochs").value) ;
         await f.train () ;
         btnTrain.innerText = "Train" ;
         btnTrain.disabled = false;  
         logger ("Training Ended");
}} ;

// Model Prediction Control
let btnPred = document.getElementById ("btnPred");
btnPred.addEventListener ( "click",  predict() ) ; 
function predict () {
      return async function (e)  {             
         await f.pred () ; 
      }};

// Logger Control
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
