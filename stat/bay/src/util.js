/* Author: Ravi Saripalli
 * 14th Jul 2024
 */

class Util {

static genPdf (xv, nb) { // Generate pdf from samples
      
      let xmin = jStat(xv).min() ;
      let xmax = jStat(xv).max() ;
      let dx = (xmax - xmin) / nb ;
      console.log (JSON.stringify({xmin: xmin , xmax: xmax}));
      console.log (JSON.stringify({mean: jStat.mean(xv), std: jStat.stdev(xv)})) ;
      let spdf  = jStat.histogram (xv, nb) ;
      let xm = [] ;
      for (let k=0 ; k < nb ; k++) {
          xm.push ( xmin + k * dx + dx/2 ) ;
	  spdf [k] = ( spdf[k] / xv.length ) / dx ;
      }
     return ({x: xm, y: spdf})
} // end genPdf

static  eigen(A) {
    // Calculate Eigen Values of Matrix A
    //var A = jStat([[2,1,0], [1,3,-1], [0, -1, 6]]);
    var Q, R;
    for (var i=0; i<20 ; i++){
      [Q, R] = jStat.QR(A) ; 
      A = jStat(R).multiply(Q) ; 
    }
    var ev = jStat(jStat.diag(A)).transpose() ;
    ev = jStat.rowa(ev,0);  // pure array of eigen vectors
    return({ev: ev, A: A});;
} // end eigen

static test(N) { 
    var pdf = new pdfD(3) ;
    pdf.x = [1,2,3];
    pdf.p = [0.2,0.5,0.3] ; 
    var y = pdf.sample(N); 
    pdf.update(y); 
    console.log(pdf);
  } // end test

  // Generic slider that can be added to a dom element "obj
static  addSlider (obj, tag, min, max, step, defVal, tooltip) {
    // A useful slider with all options I like
    const lbl = document.createElement("label") ;
    const Slide = document.createElement("input") ;
    Slide.name = tag ;

    Slide.class = "slider" ;
    Slide.type = "range" ;
    Slide.setAttribute("min", min);
    Slide.setAttribute("max", max);
    Slide.setAttribute("step", step);
    Slide.addEventListener("change", function() {
	lbl.innerText =   tag + ": " + Slide.value;
    });
    lbl.innerText =   tag + ": " + defVal;
    Slide.value =  defVal;
    Slide.title = tooltip ;

    obj.appendChild (lbl) ;
    obj.appendChild (Slide) ;

  } // end Adding Slider

static  doall() {

  // Test Ball Game
    let fig1 = document.getElementById ("fig1") ;
    fig1.addEventListener ('click', () =>  {
         var game = new Ball("fig1", 0.3, 0.5) ;
         for (var i=0 ; i<3 ; i++)  game.sample(100) ;
      }) ;
    fig1.click() ;
    
  // Show Beta function
    var bpdf = new Beta() ;
    [[20, 5], [5, 20], [20, 20], [5, 5]].forEach ( (x) => {
        bpdf.plot("fig2", x[0], x[1]) ;
    });

  // Linear Regression
    var reg = new Lreg ();
    reg.testMLE ("fig3");
    reg.testMAP ("fig4");

  // Bayesian Estimate
    new Conjugate("fig5") ;
    document.getElementById ("fig5").click() ;

  // Metropolis Sampling
    new Metro ("figMetro") ;

  // Hamiltonian Sampling
    new Ham ("figHam") ; 
    new Ham2 ("figHam2") ;
  } // end doall


  /* Helper method to include html file within html */
static  incHTML(fname) {
    var xhr= new XMLHttpRequest();
    xhr.open('GET', fname, true);
    xhr.onreadystatechange= function() {
	if (this.readyState!==4) return;
	if (this.status!==200) return;
	document.getElementById(fname).innerHTML = this.responseText;
    };
    xhr.send(); 
  } // end incHTML

static  includes() {
    var x = document.getElementsByClassName("include");
      for (var i=0 ; i < x.length ; i++) {
	this.incHTML(x[i].id);
      } 
  } // end includes

static autoCor (x) {
  // Auto correlation coeff, mean and std
  // get Sample mean and variances
  let mu = jStat.mean (x) ;  // estimate of sample mean
  let sig2 = jStat.variance (x,false) ; // biased variance of total sample
  let n = x.length ;
  let acc = [] ;  // Auto correlation coefficient vector
  for (let i = 0 ; i < n - 1 ; i++) {
      let sum = 0 ;
      for (let j = 0; j < n - i  ; j++) 
         sum = sum +  ( x[j] - mu ) * ( x[j+i] - mu ) ;
      acc.push ( sum / ( n * sig2 ) )  ; // biased auto cor.coeff 
  }
  return ( {mean: mu , sig2: sig2, acc: acc} ) ; 
} // end autocor

static upload (url, data) {
// uploads given file to server with url
  console.log (url, data) ;
 const send = () => {
       fetch (url, {method: 'POST', body: data})
         .then (resp => {console.log (resp);});
       }
} // end upload
} // end Util class
