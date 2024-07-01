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
              std: [.01, .01, .01, .01]} ; 
     var wprior = {mu: [0, 1, 2, -2],
                  std: [1, 1, 1, 1]} ;

    this.count = 1;  // number of batches of data
    this.nLoc = 4 ;  // number of x Locations sampled
    this.nRep = 3  ; // number of repeat measurements
    this.xrand = true ;

    this.S0 = jStat(jStat.diagonal(
                    jStat.pow(wprior.std, -2)));
   // this.S0 = jStat().rand(this.N+1).multiply(0) ; //null matrix
                   
    
    this.Mu0 = jStat(wprior.mu).transpose();
    this.ystd = .1 ; // distribution of errors in y


  } // end constructor

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

      for (var i=0 ; i<this.count ; i++){  // progressive updates with more data
        this.genData();
        this.updateW();
        //console.log("Sdiff", this.S.subtract(this.S0));
        //console.log("Mudiff", this.Mu.subtract(this.Mu0));
	this.S0 = this.S ;
	this.Mu0 = this.Mu ;

        this.plotData("Data") ;
	var wm =this.Mu.transpose();
	wm = jStat.rowa(wm,0);
        this.plotPoly(i, wm);

	this.getW(this.Mu0, this.S0);
      }
  } // end tryme

  updateY() { // updates predicted y distribution


  }
  updateW() { 
    // Updates prior distribution of <w>
    // given some data ; S, Mu matricies get updated

    var X = [] ;   // psi {functions of x}
    for (var i = 0 ; i < this.data.x.length ; i++) {
      var row = [] ;
      for(var j = 0 ; j <= this.N ; j++)
	 row.push(Math.pow(this.data.x[i], j)) ; 
         X.push(row) ;
    }

    var Y = jStat(this.data.y).transpose() ;
    var Xt = jStat(X).transpose() ;
    var XXt = Xt.multiply(X) ;

    //Update S
    var sigpm2 = 1 / (this.ystd * this.ystd ) ;
    this.S = this.S0.add(XXt.multiply(sigpm2)) ;
    console.log("S",this.S);

    // Update Mu
    this.Mu = Xt.multiply(Y).multiply(sigpm2);
    this.Mu = (this.S0).multiply(this.Mu0).add(this.Mu);
    this.Sinv = jStat(jStat.inv(this.S)) ;
    this.Mu = this.Sinv.multiply(this.Mu) ; 

    // Get predicted y distribution
    this.ysMean = jStat(this.Mu).transpose().multiply(Xt) ;
    let  z = (jStat(X).multiply(this.Sinv)).multiply(Xt);
    console.log(jStat.dimensions(X)) ;
    this.ysStd  =  this.ystd * this.ystd + z[1] ;
    console.log ("ymean =", this.ysMean, "ysStd =", this.ysStd) ;
  }   // end updateW

  snubOffDiag(A) {
    var diag = jStat.diag(A);
    diag = diag.map((c,i)=>c[0]);
    diag = jStat.diagonal(diag);
    return(jStat(diag));
  }
  
  getW(Mu, S) {
    var mu = jStat.rowa(Mu.transpose(),0); 
    var Sinv = jStat.inv(S.multiply(0.5)) ;
    var std = jStat(jStat.diag(Sinv)).transpose();
    std = jStat.pow(std,0.5);
    var v = this.w.std ;
    var srat1 = std.map((e,i)=>e/std[0]);
    var srat2 = v.map((e,i)=>e/v[0]);
    var W = {mu: mu , srat1: srat1, srat2: srat2};
    return(W) ;
  }

  plotPoly(legend, w) { // Plot a polynomial curve

          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i*0.02) ;
            let s = 0 ;
            for(var j = 0 ; j < w.length ; j++)
	       s =  s + w[j] * Math.pow(xf[i], j) ; 
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

  genData() { 
    // Generate data points from Polynomial with 
    // random noise in output (std)
    // Select polynomial coefficeints from
    // a Normal distributions (N(<wm>, stdw))
    var scale = 1 ;
    this.data.x = [] ;
    this.data.y = [] ;


    let x = [];
    for (var i=0 ; i < this.nLoc ; i++) { // chose sampled x vector
         let v = 0 ;
         if (this.xrand) { x.push (Math.random()) ; } 
         else { x.push (v) ; v = v + (1.0/M) ; }
    } 

    for(var k=0 ; k < x.length ; k++) { // evaluate y vector at x
    for(var r=0 ; r < this.nRep ; r++) {  // repeating Nrep times
       let w = [] ;
       for (var j = 0 ; j < this.N+1 ; j++) {
	    let wPdf = jStat.normal(this.w.mu[j], this.w.std[j], scale) ;
	    w.push(wPdf.sample()); // sample from w pdf
	  }
	  var ym = this.poly(w, x[k]) ; // evaluate polynomial
	  var yPdf = jStat.normal(ym, this.ystd, scale) ; // sample from y pdf 

	  this.data.x.push(x[k]) ; 
	  this.data.y.push(yPdf.sample()) ;
    } // end repeats
    } // end y vector loop 
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

  normMat(A) {
    for (var i=0 ; i < A.rows() ; i++) {
      let row = A.rowa(A,i);
    }
  }
} // end conjugate
