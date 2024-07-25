/* Author: Ravi Saripalli
 *    6th July 2024
 */

    /* Metropolis MonteCarlo sampling  */
class Metro {

  constructor (id) { // id :  figure element id
     this.fig = document.getElementById (id) ;
     this.N = 40000; // number of MonteCarlo Metropolis steps
     this.nb = 100 ; // number of bins to evaluate pdf from sample space
     this.burnF = 0.1 ;  // Fraction of iterations used for burnoff
     this.std = 1 ;   // sampling gibbs std
     this.xinit = 0.5 ;  // initial sampling point
     this.series = [] ;
     this.dlgAdd () ;
     this.run () ;
  } // end Constructor

  sample (xc) {
     /*
     Get proposed next sample from Normal distribution g()
     with mean centered around xc
     Calculate Acceptence ration using unknown probability
     function p() and the the g(). (Aratio is truncated to one if >1)
     If acceptance ratio is =1 move to proposed sample point
     otherwise move to proposed sample with probability of Aratio.
     Ignore samples during burin phase (specified by by user)
    */

    let gc = jStat.normal (xc, this.std)  ; 
    let xp = gc.sample() ;  // proposed next state
    let prat = this.p (xp) / this.p (xc) ;  

    /* Since g is symmeteric ... grat would be one
    /* if one chooses g to be nonsymmetric then grat is different from 1
    /* and that is Metropolis-Hastings algorithm
    let gp = jStat.normal (xp, this.std) ;
    let grat = gc.pdf (xp) / gp.pdf (xc) ; // verified to be one 
    console.log (xp, grat) ;
     */
    let grat = 1 ;
    let Aratio = Math.min (prat * grat, 1) ; 
    let xn = xc ; 
    if  (jStat.uniform.sample (0, 1) < Aratio ) xn = xp ;
    return (xn) ;
   } // end sample

  run () {

    // estimate pdf with above samples
     let bpdf = jStat.beta (6,2) ;
     this.p = function (x) {
             return (bpdf.pdf (x)); };

    // try with known pdf
     let xc = this.xinit ; 

    // generate samples with mcmc
      let xs = [];  xs.push (xc) ;
      for (let k=1 ; k < this.N ; k++) {
        let xn = this.sample(xc) ;
	xs.push (xn) ;
	xc = xn ;
      }

      // bin and generate pdf without burnIn samples
       let pdf = Util.genPdf (xs.slice (this.N *  this.burnF),
                              this.nb) ;

       this.series.push({x: pdf.x, y: pdf.y, mode: 'lines+markers',
			  markers: true, name: "pdf of samples" });

       let y = [] ; let x  = [] ;
       for (let k=0 ; k < 100 ; k++) {
	 x.push (k/100) ;
	 y.push (bpdf.pdf(k/100)) ;
       }

       this.series.push({x: x, y: y, mode: 'lines',
			   name: "unkown" });
       this.plot() ;
       this.series = [] ;
  }  // end test

  plot () {
     let layout = {title: 'McMc Metropolis Sampling',               
		      xaxis: {title: {text: "x"}},
		      yaxis: {title: {text: "pdf"}, range: [0,5]},
		      annotations: [],
                      autosize: false,
		      };
      
       Plotly.newPlot(this.fig, this.series, layout, 
		      {scrollZoom: false});     
  } // end plot

  dlgAdd () {   // dialogue for Metropolis Sampling
                // parameter setting

    this.dlg = document.createElement("dialog") ;
    this.frm = document.createElement("form") ;
    let OKbtn = document.createElement("button") ;
    OKbtn.innerText = "OK" ;
    OKbtn.type = "submit" ;
    
    Util.addSlider (this.frm, "N", 1000, 50000, 1000, 25000, "Sample Size") ;
    Util.addSlider (this.frm, "burnF", 0, 1, 0.1, 0.7, "Burn in Fraction of Samples") ;
    Util.addSlider (this.frm, "std", 0, 5, 0.2, 1, "Proposal standard deviation") ;
    this.frm.appendChild (OKbtn) ;
    this.dlg.appendChild (this.frm) ;
    this.fig.appendChild (this.dlg) ;
    this.fig.addEventListener ("click", ((e)=> { 
        this.dlg.showModal () ;
    }));

    this.frm.addEventListener("submit", ((e) => {
	 e.preventDefault() ;
	 let fd = new FormData(this.frm) ;      
	 this.N = parseInt (fd.get("N")) ;
	 this.std = parseFloat (fd.get("std")) ;
	 this.burnF = parseFloat (fd.get("burnF")) ;
	 this.run() ;
         this.dlg.close() ;
    }).bind (this));

  } // dlgAdd

} // end Metro class
