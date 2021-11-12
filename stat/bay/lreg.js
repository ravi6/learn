class lreg {
  /*
   Linear Regression 
    Given data (x_i, y_i)  i=1..M
    Assuming y_i  as random variables
    distributed normally around y_i with 
    fixed standard deviation 
  */
  constructor () {
      this.series = [] ;
      this.data = { x: [] , y: [] } ;
  }

  mle() { // Find optimal W_i and std based on (Max Likelyhood Estimate)
    var X = [] ; 
    for (var i = 0 ; i < this.M ; i++) {
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

  plot(fig) {
	 this.series.push({x: this.data.x,
		           y: this.data.y,
	                type: 'scatter',
                        mode: 'markers',
		        name: 'data' });
          let yf = [] ; 
          let stdSum = 0 ;
          for (var i = 0 ; i < this.M ; i++) {
            let s = 0 ;
            for(var j = 0 ; j <= this.N ; j++)
	       s =  s + this.w[j] * Math.pow(this.data.x[i], j) ; 
            yf.push(s) ;
	    stdSum = stdSum + Math.pow((this.data.y[i] - s), 2) ;
	  }
         this.std = Math.pow(stdSum / this.M , 0.5);
	 this.series.push({x: this.data.x,
		           y: yf,
	                type: 'line',
		      name: 'fit' });

     var info = sprintf("Fit:  std = %4.2f  w = [%4.1f %4.1f %4.1f %4.1f] ", 
                            this.std, this.w[0], this.w[1], this.w[2], this.w[3] );
     var layout = { title: 'Linear Regression',               
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

  genData(std, Nrepeat) { // Generate data from Polynomial with 
                   // random noise in output (std)
    var tdata = {x: [] , y: []};
    this.M = 11 * Nrepeat ;
    this.N = 3 ;
    var w = [1, 2, 3, 4];  // Polynomial used to gen data
    for (var i = 0 ; i < 11 ; i ++) {
      var x = i / 10  ;
      var yt = this.poly(w, x) ;
      tdata.x.push(x) ; tdata.y.push(yt) ;

      // Take several samples at same x
      var scale = 1 ;
      var yd = jStat.normal(yt, std, scale) ;
      for (var k = 0 ; k < Nrepeat ; k++) { // repeat measurements
        this.data.x.push(x) ;
        this.data.y.push(yd.sample()) ;
      }
    }

    // Desired Fit Trend
	 this.series.push({x: tdata.x,
		           y: tdata.y,
	                type: 'line',
		      name: 'actual' });
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
