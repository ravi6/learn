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
      P(w_j) = N(wm_j, sigma_w) for all w_j

     Maximize Posteriori probability
     density (unNormalized) w.r.t <w>
     given <x,y> data, and prior distribution of <w>
  */

  constructor () {
      this.fig = "fig4";
      this.data = {x: [] , y: []} //this data is generated with
      this.N = 2 ; // Polynomial Degree 
      this.wm = [1, 2, 3] ;
      this.std =  0.1; // Standard Deviation of  error in y-Poly(w,x)
      this.stdw = 0.3; // Standard deviation of noise in <w>

      this.series = [] ;
      this.layout = {title: 'Linear Regression - MAP & MLE',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
	            annotations: [],
                    };
   
      this.annotate(0.1, 0.9, "Data Generated with:");
      var info = JSON.stringify({std: this.std, stdw: this.stdw, wm: this.wm});
      this.annotate(0.1, 0.8, info);
      this.genData(10);
        
        this.plotData("Data") ;

	this.mle();
        info = sprintf("mle: w = [%4.1f %4.1f %4.1f] ", 
	                     this.w[0], this.w[1], this.w[2] );
                           
	this.plotFit(info);

	this.map();
        this.annotate(0.1, 0.7, "map Prior:");
        info = JSON.stringify({std: this.std, stdw: this.stdw, wm: this.wm});
        this.annotate(0.1, 0.6, info);

        info = sprintf("map: w = [%4.1f %4.1f %4.1f] ", 
	                     this.w[0], this.w[1], this.w[2] );
	this.plotFit(info);


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
    var B = jStat(X).multiply(Y).add( 
               S.multiply(jStat(this.wm).transpose()));
    this.w = jStat(jStat.inv(A)).multiply(B);
    console.log (B);
  }   // end map

  mle() { // Find optimal W_i and std based on (Max Likelyhood Estimate)
    var X = [] ; 
    for (var i = 0 ; i < this.data.x.length ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
         X.push(row) ;
    }

    var Xt = jStat(X).transpose() ;
    var W = jStat.inv(Xt.multiply(X)) ;
        W = jStat(W).multiply(Xt);
        W = W.multiply(jStat(this.data.y).transpose()) ;
    this.w = W ;
  }   // end Max. Likelyhood Estimate

  plotFit(legend) {
          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i*0.02) ;
            let s = 0 ;
            for(var j = 0 ; j <= this.N ; j++)
	       s =  s + this.w[j] * Math.pow(xf[i], j) ; 
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

  genData(M) { 
    // Generate data from Polynomial with 
    // random noise in output (std)
    // Select polynomial coefficeints from
    // a Normal distributions (N(<wm>, stdw))
    var scale = 1 ;

    // x values at which y's are measured repeatedly
    let x = [0, 0.2, 0.4, 0.6, 0.8, 1.0] ;

    for (var i=0 ; i < M ; i++) {
      for(var k=0 ; k < x.length ; k++) {
        let w = [] ;
        for (var j = 0 ; j < this.N+1 ; j++) {
          let wPdf = jStat.normal(this.wm[j], this.stdw, scale) ;
	  w.push(wPdf.sample()); // sample
	}
        var ym = this.poly(w, x[k]) ;
        var yPdf = jStat.normal(ym, this.std, scale) ; 

        this.data.x.push(x[k]) ; 
        this.data.y.push(yPdf.sample()) ;
      }
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
 
  annotate(x, y, txt) { // Relative to paper no arrrow
     this.layout.annotations.push(
	 {text: txt, xref: 'paper', yref: 'paper', 
	  x: x, y: y, showarrow: false});
  }
} // end lreg
