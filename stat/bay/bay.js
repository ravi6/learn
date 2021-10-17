class pdfD {
  
  // Discrete variable pdf 
  
    constructor (n) { //n possible outcomes
      this.n = n ; 

      // Default x, p values
      for (i=0 ; i < n ; i++) {
	     this.x[i] = i ;
	     this.p[i] = 1/n ; 
      }

      // Update Cumulative p's
      this.pc[0] = this.p[0] ;
      for (i=1 ; i < n ; i++) 
	  this.pc[i] = this.pc[i-1] + this.p[i] ;

    } // end constructor


   update (d) { 
    // Update discrerte pdf from samples of x 

      this.count = new Array(this.n).fill(0) ;
    // bin the data
      for (i=0 ; i<d.length ; i++) {
	     for (j=0 ; i<this.n ; j++){
	       if (d[i] == this.x[j]) ++this.count[j]  ; 
	     }
      }

    // update p values
        let tcount = this.count.reduce((a,b) => a+b, 0);
        for(i=0 ; i<this.n ; i++)
    	  this.p[i] = this.count[i] / tcount ;
  } // end update 

  E(pdf) {
    // Returns expected value of pdf

    xm = 0 ;
    for (i=0 ; i<this.n ; i++)
        xm = xm + this.p[i] * this.x[i] ;
    return(xm);
  } // end E

  sample(N){
    // Generate a sample of size N 

    var s = new Array(N).fill(0) ;
    for (i=0 ; i<N ; i++) { 
	   r = rand() ; 
	   for (k=0 ; k<this.n ; k++) {
	       if (r < this.pc[k] ) break ;
	   }
	   s(i) = this.x[k] ;  
     }
    return (s) ;
  } // end sample

  test(N) { 
    this.x=[1,2,3];
    this.p=[0.2,0.5,0.3] ; 
    var y = this.sample(N); 
    this.update(y); 
  } // end test

} // end pdfD class