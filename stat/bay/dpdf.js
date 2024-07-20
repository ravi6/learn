class Dpdf {
  // Discrete variable pdf 
  
    constructor (n) { //n possible outcomes
      this.n = n ; 
      this.x = new Array(n);
      this.p = new Array(n);
      
      // Default x, p values
      for (var i = 0 ; i < n ; i++) {
	     this.x[i] = i ;
	     this.p[i] = 1/n ; 
      }

    } // end constructor

   pCum () {  // Return cumulative probability
      var pc = new Array(this.n) ;
      pc[0] = this.p[0] ;
      for (var i=1 ; i < this.n ; i++) 
	     pc[i] = pc[i-1] + this.p[i] ;
      return (pc) ;
     } // end pCum

   update (d) { 
    // Update discrerte pdf from samples of x 

    // bin the data
      var count = new Array(this.n).fill(0) ;
      for (var i = 0 ; i < d.length ; i++) {
	     for (var j = 0 ; j < this.n ; j++)
	       if (d[i] == this.x[j]) count[j]++  ; 
      }

    // update p values
        let tcount = count.reduce((a,b) => a+b, 0);
        for(var i = 0 ; i < this.n ; i++)
    	  this.p[i] = count[i] / tcount ;
  } // end update 

  E(pdf) {
    // Returns expected value of pdf

    xm = 0 ;
    for (var i = 0 ; i < this.n ; i++)
        xm = xm + this.p[i] * this.x[i] ;
    return(xm);
  } // end E

  sample(N){
    // Generate a sample of size N 
    var s = new Array(N) ;
    var pc = this.pCum () ;
    for (var i = 0 ; i < N ; i++) { 
	   let r = Math.random() ; 
	   for (var k = 0 ; k < this.n ; k++) {
	       if (r < pc[k] ) break ;
	   }
	   s[i] = this.x[k] ;  
     }
    return (s) ;
  } // end sample

} // end Dpdf
