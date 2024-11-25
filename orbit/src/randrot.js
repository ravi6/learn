export class RandRots {
  // Facilitates Random rotation of an object
  //   desinged to automate rendering and storing in a big batch
    constructor (n, tmax) {
        this.n = n ;
	this.tmax = tmax ;  // max rot in raidans
        this.i = 0 ; this.j = 0 ; this.k = 0 ; // rotation indicies
        this.count = 0 ; 
        this.rots = [] ;
    }
    
    rotate (obj) {  // move to next rotation
         let nn = this.n - 1 ;
         this.fname  = "p" + this.format (this.i) 
          + this.format (this.j) + this.format (this.k) + ".png" ;

         let xa = Mah.random () * this.tmax ;
         let ya = Math.random () * this.tmax ;
         let za = Math.random () * this.tmax '

         let rad = Math.PI / 180.0 ;
         obj.rotation.x = xa * rad ;
         obj.rotation.y = xb * rad ;
         obj.rotation.z = xc * rad ;
         this.rots.push ({x: xa , y: ya, z: za})  ;
        
         this.i ++ ;
         if (this.i > nn) { this.i = 0 ; this.j ++ ; }
         if (this.j > nn) { this.j = 0 ; this.k ++ ; }
         if (this.k > nn) return (false) ;
         this.count = this.count + 1 ;
         return (true) ;
    } // end next
        
    format (num) {
         let s = num.toFixed(0) ;
         if (num < 10) s = "0" + s ;
     return (s) ;
    } // 

} // end Random rots Class
