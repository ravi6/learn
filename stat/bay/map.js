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
     given <x,y> data, and prior distribution of <w>
  */

  constructor () {
      this.fig = "fig4";
      this.N = 2 ; // Polynomial Degree 
      this.data = {x: [] , y: [], //this data is generated with
	           std: 0, // Standard Deviation of  error in y-Poly(w,x)
	          stdw: 0}; // Standard deviation of noise in <w>
     // w in the following is just to track how w's are evolving
    //  they are not hyperparameters. <w> is random variable.

      this.series = [] ;
      this.layout = { title: 'Linear Regression - MAP',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
              annotations: [{text: " ", 
		             xref: 'paper', yref: 'paper', 
	                        x: 0.1, y: 0.9,
		        showarrow: false}],
                  };
   
      for(var j=0 ; j < 6 ; j++) {
        this.genData(0.5, 0.02);
	this.map();
	this.plotFit(sprintf("Np=%d",this.data.x.length));
      }
         this.plotData("Data") ;

  } // end constructor

  map() { 
    // Get <w> through maximization of apriori prob
    var X = [] ; 
    for(var j = 0 ; j < this.N+1 ; j++) {
      var row = [] ;
      for (var i = 0 ; i < this.data.x.length ; i++) 
	 row.push(Math.pow(this.data.x[i], j)) ; 
      X.push(row) ;
    }
    
    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;
    var S = jStat(jStat.identity(this.N+1)) 
             .multiply(this.std / (2 * this.stdw)) ;

    var A = jStat(X).multiply(Xt).subtract(S) ;
    var W = jStat(jStat.inv(A)).multiply(X).multiply(Y) ;
    this.w = W ;
  }   // end map

  plotFit(legend) {
          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i*0.02) ;
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
     Plotly.newPlot(this.fig, this.series, this.layout, 
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

    let x = [0, 0.2, 0.4, 0.6, 0.8, 1.0] ;
    let wm = [1,2,3,4];

      for(var k=0 ; k < x.length ; k++) {
        let w = [] ;
        for (var j = 0 ; j < this.N+1 ; j++) {
          let wPdf = jStat.normal(wm[j], stdw, scale) ;
	  w.push(wPdf.sample()); // sample
	}
       var ym = this.poly(w, x[k]) ;
       var yPdf = jStat.normal(ym, std, scale) ; 

      this.data.x.push(x[k]) ; 
      this.data.y.push(yPdf.sample()) ;
   }
  } // end genData

  plotData(legend) {
    this.series.push({x: this.data.x,
                      y: this.data.y,
                   type: 'scatter',
                   name: legend,
		        showlegend: true,
                   mode: 'markers' });
     Plotly.newPlot(this.fig, this.series, this.layout, 
                    {scrollZoom: false});     
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
