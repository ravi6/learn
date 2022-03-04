function incHTML(fname) {
  var xhr= new XMLHttpRequest();
  xhr.open('GET', fname, true);
  xhr.onreadystatechange= function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return;
      document.getElementById(fname).innerHTML = this.responseText;
  };
  xhr.send(); 
}

function includes() {
  var x = document.getElementsByClassName("include");
    for (var i=0 ; i < x.length ; i++) {
      incHTML(x[i].id);
    } 
}

function test(N) { 
  var pdf = new pdfD(3) ;
  pdf.x = [1,2,3];
  pdf.p = [0.2,0.5,0.3] ; 
  var y = pdf.sample(N); 
  pdf.update(y); 
  console.log(pdf);
} // end test

function showBeta(){
  // Show a sample of beta distributions
  var bpdf = new pdfBeta() ;
  bpdf.plot("fig2", 20, 5) ;
  bpdf.plot("fig2", 5, 20) ;
  bpdf.plot("fig2", 20, 20) ;
  bpdf.plot("fig2", 5, 5) ;
}

function estimate() {
  // Finally I get Bayesian update for discrete distribution
    var game = new ballGame("fig1", 0.3, 0.5) ;
    for(var i=0 ; i<3 ; i++)  game.sample(100) ;
}

function doall() {
  estimate() ;
  showBeta() ;
  var reg = new lreg();
//  reg.testMLE("fig3");
//  reg.testMAP("fig4");
  var conj = new conjugate() ;
  conj.tryme("fig5") ;
}

function eigen(A) {
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
}
