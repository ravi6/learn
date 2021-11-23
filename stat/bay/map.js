class map {
  /*
   Linear Regression 
    Given data (x_i, y_i)  i=1..M
    fit it to a polynomial of degree N-1
    with Maximal Apriori Probability algorithm
    
    Proposed model and distributions
    y = Polynom(<w>,x) + e    
      where polnomial coefficients <w>, and e 
      are normally distributed as follows

      P(e) = N(0, sigma)
      P(w_j) = N(0, sigma_w) for all w_j

     Maximize Posteriori probability
     density (unNormalized) w.r.t <w>
     given <x,y> data, sigma & sigma_w
     and prior product distribution of
  */

  constructor () {
      this.N = 3 ; // Polynomial Degree 
      this.M = 100 ; // Sample Size
      this.data = {x: [] , y: [], //this data is generated with
	           std: 0, // Standard Deviation of  error in y-Poly(w,x)
	          stdw: 0}; // Standard deviation of noise in <w>
     // w in the following is just to track how w's are evolving
    //  they are not hyperparameters. <w> is random variable.
      this.prior = {w: [], std: 0, stdw: 0} ;
      this.post = {w: [],  std: 0, stdw: 0} ;
      this.series = [] ;
      this.genData(0.1, 0.02);
      this.prior.std = 0.05;
      this.prior.stdw = 0.01 ;
      this.map();
      this.plot("fig4");
  }

  map() { 

    // Get <w> through maximization of apriori prob
    var X = [] ; 
    for(var j = 0 ; j < this.N+1 ; j++) {
      var row = [] ;
      for (var i = 0 ; i < this.M ; i++) 
	 row.push(Math.pow(this.data.x[i], j)) ; 
      X.push(row) ;
    }
    
    var Y = jStat(this.data.y).transpose() ;
    var S = jStat(jStat.identity(this.N+1)) 
             .multiply(this.prior.std / (2 * this.prior.stdw)) ;
    var Xt = jStat(X).transpose() ;
    var A = jStat(X).multiply(Xt).subtract(S) ;
    var W = jStat(jStat.inv(A)).multiply(X).multiply(Y) ;
    var Phi = W.transpose().multiply(X).transpose() ;
    A = jStat(Y).subtract(Phi) ;

    this.post.std  = Math.pow(A.transpose().multiply(A) / this.M, 0.5) ;    
    this.post.stdw = Math.pow(W.transpose().multiply(W) / this.N, 0.5) ;    
    this.post.w = W ;
    console.log("Prior:", this.prior, "Post:", this.post);
  }   // end map

  plot(fig) {
	 this.series.push({x: this.data.x,
		           y: this.data.y,
	                type: 'scatter',
                        mode: 'markers',
		        name: 'data' });
          let yf = [] ; 
          let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i/50.0) ;
            let s = 0 ;
            for(var j = 0 ; j <= this.N ; j++)
	       s =  s + this.post.w[j] * Math.pow(xf[i], j) ; 
            yf.push(s) ;
	  }
	 this.series.push({x: xf, y: yf,
	                type: 'line',
		      name: 'fit' });

    
     var info = "" ; // sprintf("Fit:  std = %4.2f  w = [%4.1f %4.1f %4.1f %4.1f] ", 
                        //      this.std, this.w[0], this.w[1], this.w[2], this.w[3] );
     var layout = { title: 'Linear Regression - MAP',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
              annotations: [{text: info, xref: 'paper', yref: 'paper', 
	                        x: 0.1, y: 0.9, showarrow: false}],
                    showlegend: true,
                  };
   
     Plotly.newPlot(fig, this.series, layout, 
                    {scrollZoom: false});     
  } // end plot

  getSize(x)  {
    // Get size of 2D matrix
     return {M: x.length , N: x[0].length}; 
  }

  genData(std, stdw) { 
    // Generate data from Polynomial with 
    // random noise in output (std)
    // Select polynomial coefficeints from
    // a Normal distribution (N(0,stdw))
    var scale = 1 ;

    for (var i = 0 ; i < this.M ; i ++) {
      var x = Math.random()*1 ; // Assume x range is 0-10
      let w = [] ;
      let wPdf = jStat.normal(0, stdw, scale) ;
      for (var j = 0 ; j < this.N+1 ; j++)
	  w.push(wPdf.sample()); // sample
      var ym = this.poly(w, x) ;
      var yPdf = jStat.normal(ym, std, scale) ; 

      this.data.x.push(x) ; 
      this.data.y.push(yPdf.sample()) ;
   }
      this.data.std = std ;
      this.data.stdw = stdw ;
       console.log("DATA:", this.data) ;
  } // end genData

  poly(c, x) {
    // Evaluate polynomial at x
    var N = c.length  ; // number of Polynomial coeffs
    var pval = c[N-1] ;
    for (var i = N-2 ; i >= 0  ; i--)
       pval = pval * x + c[i] ; 
    return(pval);
  }

} // end lreg
