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
             std: [0.01, 0.01, 0.01, 0.01]} ; 
    var wprior = {mu: [0, 1, 2, -2],
                 std: [0.01, 0.01, 0.02, 0.005]} ; 
    this.S0 = jStat(jStat.diagonal(
                     jStat.pow(wprior.std, -2)));
    
    console.log("S0",this.S0);
    this.Mu0 = jStat(wprior.mu).transpose();
    this.ystd = 0.0001 ; // distribution of errors in y

  } // end constructor

  updateW() { 
    // Updates prior distribution of <w>
    // given some data ; S, Mu matricies get updated
    var X = [] ; 
    for (var i = 0 ; i < this.data.x.length ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
         X.push(row) ;
    }

    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;

    //Update S
    var sigpm2 = 1 / (this.ystd * this.ystd ) ;
    this.S = this.S0.add(Xt.multiply(X).multiply(sigpm2)) ;

    // Update Mu
    this.Mu = Xt.multiply(Y).multiply(sigpm2);
    this.Mu = (this.S0).multiply(this.Mu0).add(this.Mu);
    this.Mu = jStat(jStat.inv(this.S)).multiply(this.Mu) ; 

   /*
    // Snub all off diagonals
    var A = jStat.inv(this.S) ;
    A = jStat.diag(A) ;
    A = jStat.diagonal(A) ;
    A = jStat.inv(A) ;
    this.S = jStat(A) ;
    console.log("S",this.S);
  */
  }   // end updateW

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
    this.data.x = [] ;
    this.data.y = [] ;

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
	        showlegend: false,
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

  strVec(v, p) { // Convert Vector to string
    var str = "[";
     for(var i = 0 ; i < v.length ; i++) {
       str = str + v[i].toPrecision(p) + " "  ;
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

      for (var i=0 ; i<3 ; i++){  // progressive updates with more data
        this.genData(10);
        // this.plotData("Data") ;
        this.updateW();
  //    this.plotPoly(this.wpost.mu, this.wpost.mu);
	this.S0 = this.S ;
	this.Mu0 = this.Mu ;
      }
    this.getW(this.Mu, this.S);
    console.log(this.w);
  } // end tryme

  getW(Mu, S) {
    var mu = jStat.rowa(Mu.transpose(),0); 
    var Sinv = S ; //jStat.inv(S) ;
    var std = jStat(jStat.diag(Sinv)).transpose();
    std = jStat.pow(std,-0.5);
    var rat = std.map((e,i)=>e/this.w.std[i]);
    var W = {mu: mu , std: std, rat: rat};
    console.log(W) ;
    return(W) ;
  }

} // end conjugate
