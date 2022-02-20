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
             std: [0.03, 0.04, 0.01, 0.01]} ; 

    this.wprior = {mu: [0, 1, 2, -2],
                  std: [0.1, 0.1, 0.1, 0.2]} ; 
    this.wpost = this.wprior ;
    this.ystd = 0.01 ; // distribution of errors in y
  } // end constructor

  updateW() { 
    // Updates prior distribution of <w>
    // given some data
    var X = [] ; 
    for (var i = 0 ; i < this.data.x.length ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
         X.push(row) ;
    }

    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;
    var S0 = jStat(jStat.diagonal(this.wprior.std));
    var Mu0 = jStat(this.wprior.mu).transpose();

    var S = S0.add(Xt.multiply(X).multiply(this.ystd)) ;
    var Sinv = jStat(jStat.inv(S)) ;

    var Mu = Xt.multiply(Y).multiply(this.ystd);
    Mu = S0.multiply(Mu0).add(Mu);
    Mu = Sinv.multiply(Mu) ; 

    this.wpost.mu = Mu.transpose(); 
    // Just pick diagnoal of S 
    var diag = jStat(S).diag() ;
    this.wpost.std = [] ;
    for (var k=0 ; k < this.N + 1 ; k++)
         this.wpost.std.push(diag[k][0]) ;  // a kludge to overcome jStat quirk 
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

      console.log("mu", this.wpost.mu.toString()) ;
      for (var i=0 ; i<5 ; i++){  // progressive updates with more data
       this.updateW();
       console.log("mu", this.wpost.mu.toString()) ;
       this.plotPoly(this.wpost.mu, this.wpost.mu);
       this.wprior = this.wpost ;
      }
  } // end tryme


} // end conjugate
