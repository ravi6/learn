
import {pose} from "./pose.js"

let f = new pose () ;  
f.mdlFile = "http://localhost:3000/upload/cnnX" ;
f.trained = true ;
f.learnRate = 0.05 ;
f.epochs = 5 ;
f.setupModel () ;  // startup setup
f.sIndex = 9000 ;
for (let i=9 ; i < 94 ; i ++) {
  console.time('Et');
         await f.getData () ; // load Data
         console.log ("Loaded Data" + i) ;
         await f.train () ;
         console.log ("Trained" + i) ;
  console.timeEnd('Et');
 }
