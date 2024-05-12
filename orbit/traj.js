function plotit() {
  var ch1  = document.getElementById('chart1');
  const config = { 
    type : 'line'  ,
    options : { scales: { x: { type: 'linear', position: 'bottom' } } } // end options
  }

  const chart  = new Chart (ch1.getContext('2d'), config) ;
  chart.data.datasets.push (
        { data: orbit (0.5, 0.6) }
  );
}

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

plotit() ;
