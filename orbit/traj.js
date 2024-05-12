function plotit(cv, alpha, beta) {
  var ch  = document.getElementById(cv);
  const config = { 
    type : 'line'  ,
    options : { 
      scales: { x: { type: 'linear', position: 'bottom' } },
      title: { display: true,  text: "Orbit"}         
    } // end options
  }

  const chart  = new Chart (ch.getContext('2d'), config) ;
  let lbl = "alpha  = " +  alpha + " beta = " + beta ;
  chart.data.datasets.push (
        { data: orbit (alpha, beta), 
	  label: lbl,
	  pointRadius: 0
	}
  );
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
  console.log(data);
  return (data) ;
}

plotit("chart1", 0.5, 0.6) ;
plotit("chart2", 0.5, 1.6) ;
