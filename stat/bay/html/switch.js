// Author: Ravi Saripalli
// I use this to reduce internet traffic and increase
// response time of my apps running locally with local
// cdn copies of js packages o

function localise (local) {
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

    if (local) {
      document.addEventListener ("DOMContentLoaded", () => {
	  document.getElementById ("boot").src = "cdn/bootstrap.bundle.min.js" ;
	  document.getElementById ("jstat").src = "cdn/jstat.min.js" ;
	  document.getElementById ("plotly").src = "cdn/plotly.min.js" ;
	  document.getElementById ("MathJax-script").src =
		       "cdn/MathJax/es5/tex-chtml.js"; 
      }); // end adding eventListener
         console.log ("Using local cdn") ;
      }
} // end localise
