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
      this.data = {x: [] , y: [], std: 0, stdw: 0};
      this.prior = {w: [], std: 0.3, stdw: 0.2} ;
      this.post = {w: [],  std: 0.3, stdw: 0.2} ;
      this.series = [] ;
      this.genData(10, 0.1, 0.2);
      this.plot("fig4");
      this.map();
  }

  map() { 
    // Get <w> through maximization of apriori prob
    var X = [] ; 
    for (var i = 0 ; i < this.M ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
         X.push(row) ;
    }

    var S = jStat.identity(N).multiply(prior.std / (2 * prior.stdw)) ;
    var Xt = jStat(X).transpose() ;
    var A = jStat(X).multiply(Xt).subtract(S).inverse() ;
    var Y = jStat(this.data.y).transpose() ;
    var W = jStat.inv(A).multiply(X).multiply(Y) ;
    var Phi = jStat(W).transpose().multiply(X).transpose() ;
    A = jStat(Y).subtract(Phi) ;
    this.std = A.multiply(A.transpose) ;    
    console.log(this.post, this.prior);
  }   // end map

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
	       s =  s + this.post.w[j] * Math.pow(this.data.x[i], j) ; 
            yf.push(s) ;
	    stdSum = stdSum + Math.pow((this.data.y[i] - s), 2) ;
	  }
         this.std = Math.pow(stdSum / this.M , 0.5);
	 this.series.push({x: this.data.x,
		           y: yf,
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

  genData(M, std, stdw) { 
    // Generate data from Polynomial with 
    // random noise in output (std)
    // Select polynomial coefficeints from
    // a Normal distribution (N(0,stdw))
    this.N = 3 ;  //Polynomial degree + 1
    var scale = 1 ;
    for (var i = 0 ; i < M ; i ++) {
      var x = Math.random()*10 ; // Assume x range is 0-10
      let w = [] ;
      let wPdf = jStat.normal(0, stdw, scale) ;
      for (var j = 0 ; j < this.N ; j++)
	  w.push(wPdf.sample()); // sample
      var ym = this.poly(w, x) ;
      var yPdf = jStat.normal(ym, std, scale) ; 

      this.data.x.push(x) ; 
      this.data.y.push(yPdf.sample()) ;
      this.data.std = std ;
      this.data.stdw = stdw ;
   }
       console.log(this.data) ;
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
