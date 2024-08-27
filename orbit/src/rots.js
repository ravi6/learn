export class Rots {
  // Facilitates sequential rotation of an object
  //   desinged to automate rendering and storing in a big batch
  //   when isRand true generated images at random rotations
  //   Nb: All Angles in Radians

    constructor (n, tmax, isRand) {
        this.n = n ;
	this.tmax = tmax ;  // max rot in raidans
        this.i = 0 ; this.j = 0 ; this.k = 0 ; // rotation indicies
        this.count = 0 ; 
        this.rots = [] ;  // holds file name and associated rotations
        this.isRand = isRand ;
        if (! isRand)
	      this.dt = tmax / (n - 1) ;  // dtheta in radians
    }
    
    rotate (obj) {  // move to next rotation
         let nn = this.n - 1 ;
         this.fname  = "p" + this.format (this.i) 
          + this.format (this.j) + this.format (this.k) + ".png" ;

         let xa, ya, za ;
         if ( this.isRand ) {
	   xa = Math.random () * this.tmax ;
	   ya = Math.random () * this.tmax ;
	   za = Math.random () * this.tmax ;
	 }
	 else {
	   xa = this.i * this.dt ;
	   ya = this.j * this.dt ;
	   za = this.k * this.dt ;
	 }
        
	 obj.rotation.x = xa ;
	 obj.rotation.y = ya ;
	 obj.rotation.z = za ;
	 this.rots.push ({fname: this.fname, x: xa , y: ya, z: za})  ;

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
