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
      this.fig = "fig4";
      this.N = 3 ; // Polynomial Degree 
      this.M = 10 ; // Sample Size
      this.data = {x: [] , y: [], //this data is generated with
	           std: 0, // Standard Deviation of  error in y-Poly(w,x)
	          stdw: 0}; // Standard deviation of noise in <w>
     // w in the following is just to track how w's are evolving
    //  they are not hyperparameters. <w> is random variable.
      this.prior = {w: [], std: 0, stdw: 0} ;
      this.post = this.prior ;
      this.series = [] ;
      this.prior.std = 0.001;
      this.prior.stdw = 0.001 ;

      for(var j=0 ; j < 6 ; j++) {
      for(var i=0 ; i < 50 ; i++) {
        this.genData(0.002, 0.002);
        //this.plotData("") ;
	this.map();
	this.prior = this.post ;
      }
	this.plotFit(sprintf("fit%d",j));
      }

  } // end constructor

  map() { 
    // Get <w> through maximization of apriori prob
    var X = [] ; 
    console.log("Length: ", this.data.x.length);
    for(var j = 0 ; j < this.N+1 ; j++) {
      var row = [] ;
      for (var i = 0 ; i < this.data.x.length ; i++) 
	 row.push(Math.pow(this.data.x[i], j)) ; 
      X.push(row) ;
    }
    
    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;
    var S = jStat(jStat.identity(this.N+1)) 
             .multiply(this.prior.std / (2 * this.prior.stdw)) ;

    var A = jStat(X).multiply(Xt).subtract(S) ;
    var W = jStat(jStat.inv(A)).multiply(X).multiply(Y) ;
    var Phi = W.transpose().multiply(X).transpose() ;
    A = jStat(Y).subtract(Phi) ;

//    this.post.std  = Math.pow(A.transpose().multiply(A) / this.M, 0.5) ;    
//    this.post.stdw = Math.pow(W.transpose().multiply(W) / this.N, 0.5) ;    
    this.post.std = this.prior.std ;
    this.post.stdw = this.prior.stdw ;
    this.post.w = W ;
    console.log("Prior:", this.prior, "\nPost:", this.post);
  }   // end map

  plotFit(legend) {
          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 5 ; i++) {
            xf.push(i/5.0) ;
            let s = 0 ;
            for(var j = 0 ; j <= this.N ; j++)
	       s =  s + this.post.w[j] * Math.pow(xf[i], j) ; 
            yf.push(s) ;
	  }
	 this.series.push({x: xf, y: yf,
	                type: 'line',
	                markers: false,
		      name: legend });
    
     var info = "" ; 
     var layout = { title: 'Linear Regression - MAP',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
              annotations: [{text: info, 
		             xref: 'paper', yref: 'paper', 
	                        x: 0.1, y: 0.9,
		        showarrow: false}],
                  };
   
     Plotly.newPlot(this.fig, this.series, layout, 
                    {scrollZoom: false});     
  } // end plotfit

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
    let wPdf = jStat.normal(0, stdw, scale) ;

    let x = [0, 0.2, 0.4, 0.6, 0.8, 1.0] ;
  //  this.data.x = [] ; this.data.y = [] ;
      for(var k=0 ; k < x.length ; k++) {
        let w = [] ;
        for (var j = 0 ; j < this.N+1 ; j++)
	  w.push(wPdf.sample()); // sample
       var ym = this.poly(w, x[k]) ;
      var yPdf = jStat.normal(ym, std, scale) ; 

      this.data.x.push(x[k]) ; 
      this.data.y.push(yPdf.sample()) ;
   }
      this.data.std = std ;
      this.data.stdw = stdw ;
  } // end genData

  plotData(legend) {
    this.series.push({x: this.data.x,
                      y: this.data.y,
                   type: 'scatter',
		        showlegend: false,
                   mode: 'markers' });
  } // end plotData

  poly(c, x) {
    // Evaluate polynomial at x
    var N = c.length  ; // number of Polynomial coeffs
    var pval = c[N-1] ;
    for (var i = N-2 ; i >= 0  ; i--)
       pval = pval * x + c[i] ; 
    return(pval);
  }

} // end lreg
