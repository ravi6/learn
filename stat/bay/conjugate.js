class Conjugate {
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

  constructor (id) {  // figure element id 
    this.N = 3 ; // Degree of polynomial
    // This is the true distribution from which
    // data is generated

     this.w = {mu: [1, 2, -3, -1],
              std: [.01, .01, .01, .01]} ; 
     var wprior = {mu: [0, 1, 2, -2],
                  std: [1, 1, 1, 1]} ;

    this.count = 5;  // number of batches of data
    this.nLoc = 2 ;  // number of x Locations sampled
    this.nRep = 3  ; // number of repeat measurements
    this.xrand = true ;

    this.S0 = jStat(jStat.diagonal(
                    jStat.pow(wprior.std, -2)));
   // this.S0 = jStat().rand(this.N+1).multiply(0) ; //null matrix
                   
    this.Mu0 = jStat(wprior.mu).transpose();
    this.ystd = .1 ; // distribution of errors in y

    this.fig  = id ;
    this.plotSetup () ;

    let figE = document.getElementById (this.fig) ;

    // on mouse click over figure more data is fit
    figE.addEventListener ("click", ( () => {
       this.fitMoreData () ;  
    }).bind (this) );

  } // end constructor

  getPred (xv) { // Get distribution of predicted y at any x
    let V = [] ;   // psi {functions of x}
      for(var j = 0 ; j <= this.N ; j++)
	 V.push(Math.pow(xv, j)) ; 
    let X = jStat(V).transpose()  ;  // one col     
    let ym = (this.Mu.transpose()).multiply(X) ;
    let z = this.ystd * this.ystd +
           X.transpose().multiply(this.Sinv).multiply(X) ;
    return {mean: ym , std: Math.pow(z, 0.5)} ;
  }

  plotSetup () {
      this.series = [];
      this.data = {x: [] , y: []} //this data is generated with
      this.layout = {title: 'Linear Regression - Bayesian (Conjugate Priors)',               
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "y"}},
	            annotations: [],
                    };
      this.annotate(0.1, 0.3, "Data Generated with:");
      var info = JSON.stringify({std: this.ystd, stdw: this.w.std, wm: this.w.mu});
      this.annotate(0.1, 0.25, info);
  }

  fitMoreData () {
    this.genData();    // get new data only (not appended)
    this.updateW();    // get posterior and prediction estimates
    this.S0 = this.S ; // prepare for next iteration
    this.Mu0 = this.Mu ;
    this.plotData("Data") ;  // just keep adding data points to plot
    this.plotPred() ;  // replace old Prediction with new one
    /*
    var wm = this.Mu.transpose() ;
    wm = jStat.rowa(wm,0);  // row with mean w
    this.plotPoly(i, wm);
	      this.plotPred() ;
    */
  } // end fitMoreData

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
    // console.log("S",this.S);

    // Update Mu
    this.Mu = Xt.multiply(Y).multiply(sigpm2);
    this.Mu = (this.S0).multiply(this.Mu0).add(this.Mu);
    this.Sinv = jStat(jStat.inv(this.S)) ;
    this.Mu = this.Sinv.multiply(this.Mu) ; 

  }   // end updateW

  
  plotPoly(legend, w) { // Plot a polynomial curve

          let yf = [] ; let xf = [] ; 
          for (var i = 0 ; i < 50 ; i++) {
            xf.push(i*0.02) ;
            let s = 0 ;
            for(var j = 0 ; j < w.length ; j++)
	       s =  s + w[j] * Math.pow(xf[i], j) ; 
            yf.push(s) ;
	  }

     this.series.push({x: xf, y: yf, type: 'line',
	                markers: false, name: legend });
    
     Plotly.newPlot(this.fig, this.series, this.layout, 
                    {scrollZoom: false});     
  } // end plotPoly


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

  plotPred() {  // Dynamically replaced Prediction plot
    let x = [] ;
    let y = [] ; let yL = []  ; let yH = [] ;
    for (let j=0; j < 20 ; j++) {
      let ans = this.getPred(j/19.0) ;
      x.push (j/19.0) ;
      y.push (ans.mean) ;
      yL.push (-2*ans.std + ans.mean) ;
      yH.push (2*ans.std + ans.mean) ;
    }

    //centered line
    let predTrace1 = {x: x, y: y,
          type: 'scatter', name: "Predict",
	  showlegend: true };

    //shaded spread
    let xr = [... x] ; // we don't want x to be  clobbered
    xr.reverse () ;
    let xx = [... x, ... xr] ; 
    yL.reverse() ;
    let yy = [... yH, ... yL] ;
    let predTrace2 = {x: xx, y: yy, 
        fill: "tozerox",
        fillcolor: "rgba(0,176,246,0.2)",
        line: {color: "transparent"},
        showlegend: false,
        type: 'scatter' };

    let data = [] ;
    this.series.forEach ((itm) => {data.push(itm)}) ;
    data.push (predTrace1) ; data.push (predTrace2) ;
     Plotly.newPlot(this.fig, data, this.layout, 
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


// jStat(of vector) .... will become a matrix of one row
// Array diemsions is reported as column vector 
