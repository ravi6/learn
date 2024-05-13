function plotit() {
  var ch  = document.getElementById('chart1');
  const config = { 
    type : 'line'  ,
    options : { 
      scales: { x: { type: 'linear', position: 'bottom' } },
      title: { display: true,  text: "Orbit"},         
      responsive: true,
      maintainAspectRatio: false
    } // end options
  }

  const chart  = new Chart (ch.getContext('2d'), config) ;
  let alpha = 0.5 ;
  for (beta of [0.6, 1, 2, 5]) {
    let lbl = "alpha  = " +  alpha + " beta = " + beta ;
     chart.data.datasets.push (
        { data: orbit (alpha, beta), 
	  label: lbl,
	  pointRadius: 0
	}) ;
  } // end loop over beta
  chart.update() ;
} // end plotit

function orbit(alpha, beta) {
  // return descritized orbit data points
  // for specified parameters
   var data = [] ;
   for (var i=0 ; i < 100 ; i++) {
     let phi = (i * 2 * Math.PI / 100) ;
     let r = 1.0 / (beta + alpha * Math.cos(phi)) ;
     data.push ({x: r * Math.cos(phi), y: r * Math.sin(phi)}) ; 
   }
  return (data) ;
}

plotit() ;
