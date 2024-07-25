/* Author: Ravi Saripalli
 *    20th July 2024
 *
 * Hamiltonian McMc sampling  
 *  This  a posterior whose mean or std is not
 *  known.
 */
class Ham2 {

    constructor (id) {
       this.fig = document.getElementById (id) ;
       this.std = 2 ;   
       this.T = 10 ;  // integration time of trajectory
       this.nT = 10 ;  // number of time steps
       this.nb = 200 ;  // sampling bvins to generate pdf
       this.dt = this.T / this.nT ;
       this.state = {x: 0 , v: 0} ; // initial state
       this.N = 100 ; // number of samples to generate
       this.burnF = 0.1 ; // burnin samples fraction
       this.dlgAdd () ;
       this.run () ;
       this.dlg.close() ;
       this.pcntAccept ; // % of proposals accepted
    } // end Ham


    H (x, v) { // this is Hamiltonion as fn of x , and v

      // negative log of Normal dist N(0, this.std)
      let K =  v * v / (2 * this.std * this.std) ;   
      // negative log of Unnormalised pdf
      let U =  (x * x) - 
	Math.log (2 + Math.sin (5 * x) + Math.sin (2 * x)) ;  
      return (K + U) ;
      
    } // end H

    pderH (x, v) {

      let Kv =  v / (this.std * this.std) ;  // partial derivative w.r.t v
      // partial derivative w.r.t x
      let Ux =  (2 * x) - (5 * Math.cos (5 * x) + 2 * Math.cos (2 * x))  
	                  / (2 + Math.sin (5 * x) + Math.sin (2 * x)) ;
	        
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
      this.pcntAccept =
	        Math.round (100 * xv.length / this.N) ;
      return (xv) ;  // ready to bin and producing pdf

    } // end sample
 

    plot () {
        let layout = {title: ' Hamiltonian Monte Carlo Sampling',               
	      xaxis: {title: {text: "x"}, range: [-3, 3]},
	      yaxis: {title: {text: "pdf"}},
	      autosize: false,
	      };
      
       let xs = this.sample () ; 
       this.xs = xs ;  // save it for future use

      // bin and generate pdf without burnIn samples
       this.nb = Math.round (Math.sqrt (this.N - 1)) ;
       let pdf = Util.genPdf (xs.slice (this.N *  this.burnF),
                              this.nb) ;

       let series = [] ;
       series.push ({x: pdf.x, y: pdf.y, mode: 'lines+markers',
			  markers: true, name: "pdf of samples" });

       pdf = this.targetPDF () ; 
       series.push ({x: pdf.x, y: pdf.y, mode: 'lines',
			  markers: false, name: "target" });

       layout.annotations = 
	  [ { xref: "paper", yref: "paper", x: 0.2, y: 0.8,
	                  text: this.pcntAccept + "% proposals accepted",
	      showarrow: false} ];

       Plotly.newPlot (this.fig, series, layout, 
		      {scrollZoom: false});     

       this.plotAcc () ; // Generate plot for  Auto Correlation Coeff function
  } // end plot


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
    Util.addSlider (this.frm, "N", 1, 200, 10, this.N, "Sample Size") ;
    Util.addSlider (this.frm, "burnF", 0, 0.3, 0.02, this.burnF, "Sample burnin fraction") ;
    Util.addSlider (this.frm, "T", 0.1, 55, 0.2, this.T, "Integration Time") ;
    Util.addSlider (this.frm, "std", 0, 10, 0.2, this.std, "momentum dist std") ;

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
       this.run() ;
       this.dlg.close() ;
    }).bind (this));
  } //end dlgAdd

  targetPDF () { // Unnormalised
    let x = [] ; 
    let y = [] ;
    let sum = 0 ;
    for (let i=0 ; i < 100 ; i++) {
        let xv =  -3 + i * 6 / 100 ;
	let yv = Math.exp(- xv * xv) * (2 + Math.sin (5 * xv) + Math.sin (2 * xv)) ;  
        x.push (xv) ;
        y.push (yv) ;
        sum = sum + yv * 6/100.0 ; 
    }
    
    return ({x: x, y: y.map ((v) => v/sum)}) ;
  } // end targetPDF

    plotAcc () {  // plot auto correlation function
        let layout = {title: ' Sample Auto Correlation Function',               
	      xaxis: {title: {text: "n"} },
	      yaxis: {title: {text: "Auto Correlation Coeff"}},
	      autosize: false,
	      };
      
       let xs = this.xs ; // 
       let result = Util.autoCor (xs) ;

       let i = Array.from ({length: xs.length}, (v, k) => k + 1 )
       
       Util.upload ("http://localhost:3000/output", 
	              {xs: xs , auto: result} ) ;

       let series = [] ;
       series.push ({x: i, y: result.acc, mode: 'lines',
			  markers: false, name: "Hamiltonian Sampling Convergence" });

       // bit yuk ... but will do for now
       let fig = document.getElementById ("figAcc") ;
       Plotly.newPlot (fig, series, layout, 
		      {scrollZoom: false});     
  } // end plotAcc
} // end Ham2 Class
