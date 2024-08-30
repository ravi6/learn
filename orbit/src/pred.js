import z from "./output/pred.json" ;
let sum = 0 ;
for (let i=0 ; i < z.length ; i++) {
   for (let k = 0 ; k < 3 ; k++) {
     let ys = z[i].ys[k] ;
     let yp = z[i].yp[k] ;
     sum = sum + (ys - yp) * (ys - yp) ;
   }
}
let r = (180 / Math.PI) ;
console.log (Math.sqrt(sum/(z.length))) ;
