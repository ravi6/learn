class conjugate {
"use strict" ;
  /*
   Linear Regression 
    Given data (x_i, y_i)  i=1..M
    fit it to a polynomial of degree N-1
    
    Proposed model and distributions (Conjugate priors)
    y = Polynom(<w>,x) + e    
      where polnomial coefficients <w>, and e 
      are normally distributed as follows

      P(e) = N(0, sigma)
      P(w_j) = N(wm_j, sigma_w_j) for all w_j
   
  */

  constructor () {
    this.N = 3 ; // Degree of polynomial
    // This is the true distribution from which
    // data is generated
    this.w = {mu: [1, 2, -3, -1],
             std: [0.3, 0.4, 0.1, 0.1]} ; 


    this.wprior = {mu: [0, 1, 2, -2],
                  std: [0.1, 0.1, 0.1, 0.2]} ; 
    this.wpost = this.wprior ;
    this.ystd = 0.15 ; // distribution of errors in y
  } // end constructor

  updateW() { 
    // Updates prior distribution of <w>
    // given some data
    var X = [] ; 
    for(var j = 0 ; j < this.N+1 ; j++) {
      var row = [] ;
      for (var i = 0 ; i < this.data.x.length ; i++) 
	 row.push(Math.pow(this.data.x[i], j)) ; 
      X.push(row) ;
    }
    
    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;
    var S0 = jStat.diagonal(this.wprior.std);
    var Mu0 = jStat(this.wprior.mu).transpose();

    var S = S0.add(Xt.multiply(X).multiply(this.ystd)) ;
    var Sinv = jStat(jStat.inv(S)) ;
    console.log("S", S) ;

    var Mu = Xt.multiply(Y).multiply(this.ystd);
    Mu = S0.multiply(Mu0).add(Mu);
    Mu = Sinv.multiply(Mu) ; 

    this.wpost.mu = Mu;
    this.wpost.std = jStat.diag(S) ;
  }   // end map

  plotPoly(legend, w) { // Plot a polynomial curve
          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i*0.02) ;
            let s = 0 ;
            for(var j = 0 ; j < w.length ; j++)
	       s =  s + this.w[j] * Math.pow(xf[i], j) ; 
            yf.push(s) ;
	  }

	 this.series.push({x: xf, y: yf,
	                type: 'line',
	                markers: false,
		      name: legend });
    
     Plotly.newPlot(this.fig, this.series, this.layout, 
                    {scrollZoom: false});     
  } // end plotPoly

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
          let wPdf = jStat.normal(this.w.mu[j], this.w.std[j], scale) ;
	  w.push(wPdf.sample()); // sample
	}
        var ym = this.poly(w, x[k]) ;
        var yPdf = jStat.normal(ym, this.ystd, scale) ; 

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

  strVec(v) { // Convert Vector to string
    var str = "[";
     for(var i = 0 ; i < v.length ; i++) {
       str = str + sprintf("%4.1f ",v[i])  ;
     }
    return(str + "]");
  }

  tryme(fig) {
      this.fig = fig ;
      this.data = {x: [] , y: []} //this data is generated with

      this.series = [] ;
      this.layout = {title: 'Linear Regression - Bayesian (Conjugate Priors)',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
	            annotations: [],
                    };
   
      this.annotate(0.1, 0.9, "Data Generated with:");
      var info = JSON.stringify({std: this.ystd, stdw: this.w.std, wm: this.w.mu});
      this.annotate(0.1, 0.8, info);
      this.genData(10);
      this.plotData("Data") ;

      for (var i=0 ; i<5 ; i++){  // progressive updates with more data
       this.updateW();
       this.plotPoly("xxx", this.wpost.mu);
       console.log("wpost", this.wpost) ;
       this.wprior = this.wpost ;
       console.log("wprior", this.wprior) ;
          for(var j=0 ; j<1000 ; j++) {let p=0 ;}
      }
  } // end tryme


} // end conjugate
