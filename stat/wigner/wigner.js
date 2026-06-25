function bruteSpdf(sigma, N, m) {
// Brute method evaluation of pdf(s)
// N --  Number of terms in truncated series
// m --  Scaling partition
// m can take values of 0 to 3

 let pdf = {x: [] , y: []} ;
 for (s=0 ; s <= 10 ; s = s + 0.01) {
   let beta = (s/4.0/sigma)**2 ;
   let sf = Math.exp (-m * beta);  // we will see the effect of m in accuracy  
   let alpha =  Math.exp (-(3 - m) * beta ) *  s / ( (2**1.5) * sigma**2 );
   let ss = 0 ;
   for (i=0 ; i < N ; i++) {
       ss = ss + sf * (beta / 2) ** (2 * i) / (math.factorial (i))**2;
   }
       pdf.x.push (s) ; pdf.y.push (alpha * ss ) ;
 } 
   return pdf ;
}// end pdf

function i0e(z) {  // Scaled Modified Bessel Function of first kind
    let ab0 = Math.abs(z);
    if (ab0 <= 3.75) {
      let t = z / 3.75;
      let t2 = t * t;
      let ans = 1.0 + t2 * (3.5156229 + t2 * (3.0899424 + t2 * (1.2067492 
	+ t2 * (0.2659732 + t2 * (0.0360768 + t2 * 0.0045813)))));
      return ans * Math.exp(-ab0);
    } else {
      let t = 3.75 / ab0;
      let ans = 0.39894228 + t * (0.01328592 + t * (0.00225319 + t * (-0.00157565 
	+ t * (0.00916281 + t * (-0.02057706 + t * (0.02635537 
	+ t * (-0.01647633 + t * 0.00392377)))))));
      return ans / Math.sqrt(ab0);
    }
}

function wignerSurmisePdf(s, sigma) {
    if (s === 0) s = 1e-15; 
    let z = (s * s) / (16 * sigma * sigma);
    let exponentTerm = Math.exp(-(s * s) / (8 * sigma * sigma));
    let multiplier = (s / (2 * Math.sqrt(2) * sigma * sigma)) * exponentTerm;
    return multiplier * i0e(z);
}

window.addEventListener('DOMContentLoaded', (event) => {
    const input = document.getElementById('sigma-input');
    const s_vals = [];
    for (let s = 0; s <= 10; s += 0.02) { s_vals.push(s); }

    function drawPlot() {
      let sigma = parseFloat(input.value);
      if (isNaN(sigma) || sigma <= 0) return;
      const y_vals = s_vals.map(s => wignerSurmisePdf(s, sigma));

      let spdf = bruteSpdf (sigma, 5, 0) ;
      const data = [
            { x: s_vals, y: y_vals, mode: 'lines', line: { width: 3, color: '#17BECF' } },
            { x: spdf.x, y: spdf.y, mode: 'lines', line: { width: 3, color: "green" } },
           ];

      const layout = {
	  title: `Wigner Surmise Distribution | \u03C3 = ${sigma.toFixed(2)}`,
	  xaxis: { title: 'Eigen Values distance (s)', gridcolor: '#333' },
	  yaxis: { title: 'Probability Density p(s)', gridcolor: '#333' },
	  paper_bgcolor: '#111', 
	  plot_bgcolor: '#111', 
	  font: { color: '#fff' },
	  hovermode: 'x unified'
      };

      Plotly.newPlot('plot-container', data, layout);
    }  // end drawPlot

    drawPlot();
    input.addEventListener('change', drawPlot);
  }); // end Document Loaded eventListener
