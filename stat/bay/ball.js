class Ball {
     // Estimating Discrete probability function 
     // of collection of colored balls with three distinct colors by Baesian
     // Method with progressive sampling

  constructor(fig, a=0.3, b=0.5) {
      this.fig = document.getElementById (fig) ;
      this.a = a ; // fraction of color 0 balls
      this.b = b ; //             color 1 balls

      this.pdf = new Dpdf(3);
      this.pdf.x=[0,1,2] ; // each value correspond to one color
      this.pdf.p=[a, b, 1-a-b];  

     // I will pretent that I don't know the origin of this sample
     // And assume the proportion of balls are likely to be of this
     // distribution (starting prior)

     this.Epdf = []; 
     for (let a = 0 ; a <= 1 ; a = a + 0.1)  {
	  for (let b = 0  ; b <= 1-a ; b = b + 0.1) 
	     this.Epdf.push( {a: a, b: b, prior: 0.1, post: 0.1});
	}

    this.series = [] ;
    this.nS = 0 ;  // Total number of samples 
    this.plot() ;

  } // end constructor


  sample (Ns) {  // Draws Ns ball samples and updates the prior
     var y = this.pdf.sample(Ns) ;  this.nS = this.nS + Ns ;

       // Calculate posterior
	for (var k = 0 ; k < this.Epdf.length ; k++) {
	  var lhood = 1 ; var x ;
	  for (var i=0 ; i < Ns ; i++) {
		  if (y[i] == 0) x = this.Epdf[k].a ;
		  else if (y[i] == 1) x = this.Epdf[k].b ;
		  else x = 1 - (this.Epdf[k].a + this.Epdf[k].b) ;
	       lhood = lhood * x ;
	    }
	      this.Epdf[k].post = this.Epdf[k].prior * lhood ; 
	}

	// Normalize posterior
	var total = 0 ;
	for(var i = 0 ; i < this.Epdf.length ; i++)
	   total = total + this.Epdf[i].post ;
	for(var i = 0 ; i < this.Epdf.length ; i++)
	    this.Epdf[i].post = this.Epdf[i].post / total  ;
        this.plot() ;
      
        // Update prior ready for next sample
	for(var i = 0 ; i < this.Epdf.length ; i++)
	    this.Epdf[i].prior = this.Epdf[i].post   ;
         
  } // end sample

  plot() {
      var xvals = [] ; var yvals = [] ;
      for (var i = 0 ; i < this.Epdf.length ; i++) {
	     xvals.push(sprintf("%3.1f, %3.1f",this.Epdf[i].a, this.Epdf[i].b)) ;
	     yvals.push(this.Epdf[i].post) ;
	 }
	 this.series.push({x: xvals,
		           y: yvals,
	                type: 'bar',
		        mode: 'category',
		      name: sprintf("nS: %d",this.nS) });

     var anno = sprintf("True (a,b)=(%3.1f, %3.1f)", this.a, this.b);
     var layout = { title:      'Bayesian Estimates',               
                    showlegend: true,
               	    xaxis: {title: {text: "Color 0/1 proportions : (a,b)"}},
	            yaxis: {title: {text: "pdf"}},
              annotations: [{text: anno, xref: 'paper', yref: 'paper', 
	                             x: 0.1, y: 0.9, showarrow: false}]
                     };
   
     var config = { scrollZoom: false,
                    displayModeBar: false
                  }
     Plotly.newPlot(this.fig, this.series, layout, config);     
  } // end plot


} // end BallGame 
