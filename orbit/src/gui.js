// Author: Ravi Saripalli
// Place for all GUI interaction Code
//  Fashion object instantiation
import {pose} from "./pose.js"
import {upload, getFile, sleep} from "./util.js" ;


let loggerD = document.getElementById("logger");
let imgNet = document.getElementById ("imgNet") ;
imgNet.src = "imgs/cnn.png" ; 

let f = new pose () ;  
f.trained = document.getElementById ("cbTrained").checked ;
logger("Setup CNN Model") ; 
await f.setupModel () ;  // startup setup
document.getElementById ("epochs").value = f.epochs ;
document.getElementById ("learnRate").value = f.learnRate ;

logger("Model File:  " + f.mdlFile);

// All of this just to print Model Summary
      let btnSum = document.getElementById ("btnSum");
      function modSum (msg) { logger (msg); } // end modSum
      function  doit () {
	   logger ("<<<<<<<<<<<  Model Summary  >>>>>>>>>>*") ;
	//   f.model.summary() ;
           f.model.summary ( 50, [0.5, 0.75, 1],  modSum ) ;
	   logger ("<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>")  ;
       } // end doit
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

// Features display
let btnFeat = document.getElementById ("btnFeat");
btnFeat.addEventListener ("click", Feat()) ; 
function Feat () {
  const fshow =  ( async function (e)  {  
    for (let i=0 ; i < f.model.layers.length ; i++)
       console.log (i, " --> ", f.model.layers[i].name) ;
    let yoff = 0, maxW = 300 , nc = [2, 4, 6], dg = 2 ;
    let fImgs ;
    for (let m = 0 ; m < 3 ; m++) {
           if (m > 0) yoff = yoff + fImgs.h + dg ;
	   fImgs = await f.features(nc[m]) ;
	   let xoff = 0 ; if (xoff + fImgs.w + dg > maxW) {yoff = yoff + fImgs.h + dg ; xoff = 0}
	   for (let i = 0 ; i < fImgs.data.length ; i++) { 
		 drawImg (fImgs.w, fImgs.h, fImgs.data[i] , xoff, yoff) ;
		 if (xoff + fImgs.w > maxW) {yoff = yoff + fImgs.h + dg ; xoff = 0}
	         else xoff = xoff + fImgs.w + dg;
	   }} 
    });
   return (fshow) ;
} // end Feat

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

function drawImg (w, h, pix, xoff, yoff) {
  let canvas = document.getElementById ("myCanvas") ;
  let ctx = canvas.getContext ("2d") ;
  let img = ctx.createImageData (w, h) ;
  let k = 0 ;
  for (let i = 0; i < img.data.length; i += 4) {
    img.data[i] = pix [k]; // red
    img.data[i + 1] = pix [k] // green
    img.data[i + 2] = pix [k] // blue
    img.data[i + 3] = 255 // Brightness ??
    k = k + 1
  }
  ctx.putImageData(img, xoff, yoff);
};
