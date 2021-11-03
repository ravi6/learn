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
      this.genData() ;
  }

  mle() { // Find optimal W_i and std based on (Max Likelyhood Estimate)
    var X = [] ; 
    for (var i = 0 ; i < this.M ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
      X.push(row) ;
    }
    console.log(X) ;
    var Xt = jStat(X).transpose() ;
    var W = jStat.inv(Xt.multiply(X)) ;
        W = jStat(W).multiply(Xt);
        W = W.multiply(jStat(this.data.y).transpose()) ;
    this.w = W ;
  }   // end Max. Likelyhood Estimate

  plot() {
	 this.series.push({x: this.data.x,
		           y: this.data.y,
	                type: 'scatter',
                        mode: 'markers',
		      name: 'data' });


          let yf = [] ; 
          for (var i = 0 ; i < this.M ; i++) {
            let s = 0 ;
            for(var j = 0 ; j <= this.N ; j++)
	       s =  s + this.w[j] * Math.pow(this.data.x[i], j) ; 
            yf.push(s) ;
	  }

	 this.series.push({x: this.data.x,
		           y: yf,
	                type: 'line',
		      name: 'fit' });
    

     var layout = { title:      'Linear Regression',               
                    showlegend: true,
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
                  };
   
     Plotly.newPlot('fig', this.series, layout, 
                    {scrollZoom: false});     
  } // end plot

  getSize(x)  {
    // Get size of 2D matrix
     return {M: x.length , N: x[0].length}; 
  }

  genData() { // Generate known curve data with scatter
    var std = 10 ; 
    var tdata = {x: [] , y: []  };
    this.M = 33 ;
    this.N = 3 ;
   
    for (var i = 0 ; i < 11 ; i ++) {
      var x = i / 10  ;
      var yt = 1.0 + 2.0 * x + 3.0 * x * x  + 4.0 * x * x * x; 
      tdata.x.push(x) ; tdata.y.push(yt) ;

      var scale = 1 ;
      var yd = jStat.normal(yt, std, scale) ;
      for (var k = 0 ; k < 3 ; k++) { // three repeats
        this.data.x.push(x) ;
        this.data.y.push(yd.sample()) ;
      }
    }

    // Desired Fit Trend
	 this.series.push({x: tdata.x,
		           y: tdata.y,
	                type: 'line',
		      name: 'actual' });
  }
} // end ballGame 
