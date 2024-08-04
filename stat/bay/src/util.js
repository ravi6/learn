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
     return ({x: xm, y: spdf, dx: dx})
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

static autoCor (x, opt) {
  // Auto correlation coeff, mean and std
  // get Sample mean and variances
  let mu = jStat.mean (x) ;  // estimate of sample mean
  let sig2 = jStat.variance (x, false) ; // biased variance of total sample
  let n = x.length ;
  if (x.length % 2 != 0) n = n - 1 ; // making sure sample size is even
/* Limit the lag to less than half the sample
 * size (n). If increase the lag beyond this point autocorrelation
 * function begins to grow and gets back to 1 at the end.
 * Need to still understand this well. Some explanation is
 * that ACC is symmetric with reference to centered point. acc(+T)=acc(-T)
 * The data is not really time series but random samples. We are using
 * the data sequence index as time. 
 */

  let acc = [] ;  // Auto correlation coefficient 
    for (let i = 0 ; i < n/2  ; i++) {
	let cov = 0, varj = 0, varjp = 0 ;
        let muj = jStat.mean (x.slice(0,n-i-1)) ;
        let mujp = jStat.mean (x.slice(1,n-i)) ;
        if (opt == 1) { muj = mu;   mujp = mu  ; } ;
	  for (let j = 0; j < n - i  ; j++) {
	   cov = cov +  ( x[j] - muj ) * ( x[j+i] - mujp ) ;
	   varj = varj + ( x[j] - muj ) ** 2 ;
	   varjp = varjp + ( x[j+i] - mujp ) ** 2;
	}
	acc.push ( cov / Math.sqrt (varj * varjp) ) ; 
    }
  //acc.reverse() ;  // Since we iterated from all data to fewer data  
  return ( {mean: mu , sig2: sig2, acc: acc} ) ; 
} // end autocor

static upload (url, data) {
  // uploads given file to server with url
  // fetch could have been used but "hono" is 
  // not working withit ... tried all combos
  // so just keep it simple and basic xhr requests
  // No luck with simpler fetch  method  
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/output");
  xhr.setRequestHeader("Content-Type", 
                "application/json; charset=UTF-8");
  const body = JSON.stringify(data) ;

  xhr.onload = () => {  // event listener
    if (xhr.readyState == 4 && xhr.status == 201) {
      console.log(JSON.parse(xhr.responseText));
    } else { console.log(`Error: ${xhr.status}`); }
  };
  xhr.send(body) ;
} // end upload
} // end Util class
