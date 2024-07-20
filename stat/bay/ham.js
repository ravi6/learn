/* Author: Ravi Saripalli
 *    12th July 2024
 *
 * Hamiltonian McMc sampling  
 *  Let us try one dimensional case first 
 */
class Ham {

    constructor (id) {
       this.fig = document.getElementById (id) ;
       this.std = 1 ;   
       this.T = 10 ;  // integration time of trajectory
       this.nT = 10 ;  // number of time steps
       this.nb = 200 ;  // sampling bvins to generate pdf
       this.dt = this.T / this.nT ;
       this.state = {x: 0 , v: 0} ; // initial state
       this.N = 25000 ; // number of samples to generate
       this.burnF = 0.1 ; // burnin samples fraction
       this.target = {mu: 0.5, std: 1.0}
       this.dlgAdd () ;
       this.run () ;
       this.dlg.close() ;
    } // end Ham


    H (x, v) { // this is Hamiltonion as fn of x , and v

      // negative log of Normal dist N(0, this.std)
      let K =  v * v / (2 * this.std * this.std) ;   
      // negative log of Unnormalised pdf
      let U =  (x - this.target.mu) * (x - this.target.mu) /
	        (2 * this.target.std * this.target.std) ;
      return (K + U) ;
      
    } // end H

    pderH (x, v) {

      let Kv =  v / (this.std * this.std) ;  // partial derivative w.r.t v
      // partial derivative w.r.t x
      let Ux =   (x - this.target.mu) ; 
	        (this.target.std * this.target.std) ;
      return ({Kv: Kv , Ux : Ux}) ;

    } // end pderH

    leapFrog (so) { // determnistic movement

      // leapfrog numerical integration for time T
      let x0 = so.x ; let v0 = so.v ;
      let xn = so.x ; let vn = so.v ;
      for (let j = 0 ;  j < this.nT ; j++) {
	let pdH = this.pderH (x0, v0) ; // partial derivatives of H
	let vh = v0 - 0.5 * this.dt *  pdH.Ux ; // vel at half time step
	pdH = this.pderH (x0, vh) ;
	xn = x0 +  this.dt * pdH.Kv ; // full step x position based on mid velocity    
	pdH = this.pderH (xn, vh) ;
	vn = vh - 0.5 * this.dt *  pdH.Ux ;  // velocity at full time step
	x0 = xn ; v0 = vn ;
      }
 
      return ({x: xn, v: vn}) ;

    } // leapFrog integration end   

    sample () {  // Generate samples that approximate unnormalized pdf

      let xv = [] ;   // accepted samples 
      let so = this.state ;
      let uPdf = jStat.uniform (0, 1) ;
      this.vPdf = jStat.normal (0, this.std) ; // momenta of unit mass sampling pdf

      for (let i=0 ; i < this.N ; i++) {
         let sn = this.leapFrog (so) ;
	 let aP = Math.exp ( this.H (so.x, so.v) - this.H (sn.x, sn.v) );
	 aP = Math.min (1, aP) ;
	 if (uPdf.sample() < aP)  { // accept the move
	   xv.push (sn.x) ;
	   so = sn ; // prepare for next sample
	 } 
	 so.v = this.vPdf.sample() ; // get new momentum
      }
      console.log ("Accepted Samples: ", xv.length) ;
      return (xv) ;  // ready to bin and producing pdf

    } // end sample
 

    plot () {
        let layout = {title: ' Hamiltonian Monte Carlo Sampling',               
	      xaxis: {title: {text: "x"}},
	      yaxis: {title: {text: "pdf"}},
	      annotations: [],
	      autosize: false,
	      };
      
       let xs = this.sample () ; 
      // bin and generate pdf without burnIn samples
       let pdf = Util.genPdf (xs.slice (this.N *  this.burnF),
                              this.nb) ;

       let series = [] ;
       series.push ({x: pdf.x, y: pdf.y, mode: 'lines+markers',
			  markers: true, name: "pdf of samples" });

       pdf = this.targetPDF () ; 
       series.push ({x: pdf.x, y: pdf.y, mode: 'lines',
			  markers: false, name: "target" });

       Plotly.newPlot (this.fig, series, layout, 
		      {scrollZoom: false});     
  } // end plot

    targetPDF () {  // prepare for plotting target pdf
               //  cross check how Hamilton is working
       let y = [] ; let x  = [] ;
       let gauss = jStat.normal (this.target.mu, this.target.std) ;
       let xnot = this.target.mu - 3 * this.target.std ; 
       let dx =  3 * this.target.std / 50 ;
       for (let k =0 ; k < 100 ; k++) {
	 let xk = xnot + k * dx ;
	 x.push (xk) ;
	 y.push (gauss.pdf(xk)) ;
       }
     return ({x: x, y: y}) ;
  }

  run () {
    this.sample () ;
    this.plot () ;
  }


  dlgAdd () {  // Hamiltonian Sampling dialogue

    this.dlg = document.createElement("dialog") ;
    this.frm = document.createElement("form") ;
    let OKbtn = document.createElement("button") ;
    OKbtn.innerText = "OK" ;
    OKbtn.type = "submit" ;

    // populate the input form
    Util.addSlider (this.frm, "N", 1000, 50000, 1000, 25000, "Sample Size") ;
    Util.addSlider (this.frm, "burnF", 0, 0.3, 0.02, 0.1, "Sample burnin fraction") ;
    Util.addSlider (this.frm, "T", 0.1, 55, 0.2, 10, "Integration Time") ;
    Util.addSlider (this.frm, "std", 0, 10, 0.2, 1, "momentum dist std") ;
    Util.addSlider (this.frm, "tgMean", 0, 5, 0.2, 1, "target dist mean") ;
    Util.addSlider (this.frm, "tgStd", 0, 10, 0.2, 1, "target dist std") ;

    this.frm.appendChild (OKbtn) ;
    this.dlg.appendChild (this.frm) ;
    this.fig.appendChild (this.dlg) ;
    this.fig.addEventListener ("click", (() => {
        this.dlg.showModal() ;
     }).bind (this)) ;

    // After OK use the values and run
    this.frm.addEventListener("submit", ((e) => {
       e.preventDefault() ;
       this.fd = new FormData(this.frm) ;      
       this.N = parseInt (this.fd.get("N")) ;
       this.burnF = parseFloat (this.fd.get("burnF")) ;
       this.std = parseFloat (this.fd.get("std")) ;
       this.T = parseFloat (this.fd.get("T")) ;
       this.target.mu = parseFloat (this.fd.get("tgMean")) ;
       this.target.std = parseFloat (this.fd.get("tgStd")) ;
       this.run() ;
       this.dlg.close() ;
    }).bind (this));
  } //end dlgAdd

} // end Ham Class
