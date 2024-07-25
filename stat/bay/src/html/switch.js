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
	  document.getElementById ("mathjax").innerHTML = String.raw `
          MathJax = { tex: {
             tags: 'all',  // should be 'ams', 'none', or 'all'
             inlineMath: [['$', '$'], ['\\(', '\\)']] , } }; `;
    console.log (document.getElementById ("MathJax-script"));
      }); // end adding eventListener
         console.log ("Using local cdn") ;
    } else {
      document.addEventListener ("DOMContentLoaded", () => {
	  document.getElementById ("boot").src =
               "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
	  document.getElementById ("jstat").src =
                "https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js";
	  document.getElementById ("plotly").src = 
                 "https://cdn.plot.ly/plotly-2.4.2.min.js";
	  document.getElementById ("MathJax-script").src =
                 "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
	  document.getElementById ("mathjax").innerHTML = String.raw `
          MathJax = { tex: {
             tags: 'all',  // should be 'ams', 'none', or 'all'
             inlineMath: [['$', '$'], ['\\(', '\\)']] , } }; `;

             console.log (document.getElementById ("MathJax-script"));
      }); // end adding eventListener

    }
    
} // end localise
