// Author: Ravi Saripalli
// I use this to reduce internet traffic and increase
// response time of my apps running locally with local
// cdn copies of js packages o
function addHDR (local) {
   let hdr = document.getElementById ("hdr") ;

   if (local) {
      hdr.innerHTML = String.raw `
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <link  href="cdn/bootstrap.min.css" rel="stylesheet" >
      <link href="html/stat.css" rel="stylesheet">
      <title>Bayesian Statistics</title> ` ;
   } else {
      hdr.innerHTML = String.raw `
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" >
      <link href="html/stat.css" rel="stylesheet">
      <title>Bayesian Statistics</title>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /> ` ;
   }

} // end localise

function addCDN (local) {

    let cdn =  document.getElementById("cdn") ;
    if (local) {
      cdn.innerHTML = String.raw `
      <script src="cdn/bootstrap.bundle.min.js" ></script>
      <script src="cdn/jstat.min.js"> </script>
      <script src="cdn/plotly.min.js"></script>
      <script id="MathJax-script" async src="cdn/MathJax/es5/tex-chtml.js"> </script> ` ;
    } else {
      cdn.innerHTML = String.raw ` 
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" ></script>
      <script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"> </script>
      <script src="https://cdn.plot.ly/plotly-2.4.2.min.js"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"> </script>`;
    }

   let mathJ = document.getElementById ("mathJ") ;
     mathJ.innerHTML = String.raw `
     MathJax = { tex: { tags: 'all',  // should be 'ams', 'none', or 'all'
              inlineMath: [['$', '$'], ['\\(', '\\)']] , }}; `;
}

document.addEventListener ("DOMContentLoaded", ()=> {
  addHDR (true) ;
  addCDN (true) ;
});
