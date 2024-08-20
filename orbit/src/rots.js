export class Rots {
  // Facilitates sequential rotation of an object
  //   desinged to automate rendering and storing in a big batch
    constructor (n, tmax) {
        this.n = n ;
	this.tmax = tmax ;  // max rot in raidans
	this.dt = tmax / (n - 1) ;  // dtheta in radians
        this.i = 0 ; this.j = 0 ; this.k = 0 ; // rotation indicies
        this.count = 0 ; 
    }
    
    rotate (obj) {  // move to next rotation
         let nn = this.n - 1 ;
	     
         this.fname  = "p" + this.format (this.i) 
          + this.format (this.j) + this.format (this.k) + ".png" ;

         obj.rotation.x = this.i * this.dt ;
         obj.rotation.y = this.j * this.dt ;
         obj.rotation.z = this.k * this.dt ;
        
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

} // end rots Class
