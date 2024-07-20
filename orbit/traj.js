function plotit() {
  var colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ];

  var cfg1 = { 
    type : 'line'  ,
    options : { 
      scales: { x: { type: 'linear', position: 'bottom' , min: -6.5, max: 2.5 },
                y: { min: -6.5, max: 2.5 } },
      title: { display: true,  text: "Orbit"},         
      responsive: true,
      aspectRatio: 1, 
      maintainAspectRatio: true,
      plugins: {
            legend: { labels: { filter: item => item.text !== 'none' } }
        },
    } // end options
  };

  var ctx  = document.getElementById('chart1').getContext('2d');
  const  ch1  = new Chart (ctx, cfg1) ;
  let alpha = 0.5 ;
  var k = 0 ;
  for (beta of [0.7, 1, 2, 5]) {
    let c = alpha / (beta * beta - alpha * alpha) ;  // location of large object from origin
    let lbl = "alpha  = " +  alpha + ",  beta = " + beta ;
     ch1.data.datasets.push (
        { data: getorbit (alpha, beta), 
	  label: lbl, pointRadius: 0, borderColor: colors[k]
	}) ;
     ch1.data.datasets.push (
        { data: [{x: -c, y: 0}, {x: -c, y: 0}],
	  label: "none", pointRadius: 3, pointStyle: "star", borderColor: colors[k]
	}) ;
     k = k + 1 ;
  } // end loop over beta

     ch1.data.datasets.push (
        { data: [{x: 0, y: 0}], label: "none", type: 'scatter', pointRadius: 2, backgroundColor: 'black'
	}) ;
  ch1.update() ;

//   Another plot with alpha varying with beta held constant
  var cfg2 = { 
    type : 'line'  ,
    options : { 
      scales: { x: { type: 'linear', position: 'bottom' , min: -6.5, max: 2.5 },
                y: { min: -6.5, max: 2.5 } },
      title: { display: true,  text: "Orbit"},         
      responsive: true,
      aspectRatio: 1, 
      maintainAspectRatio: true,
      plugins: {
            legend: { labels: { filter: item => item.text !== 'none' } }
        },
    } // end options
  };
  var ctx2  = document.getElementById('chart2').getContext('2d');
  const  ch2  = new Chart (ctx2, cfg2) ;
  beta = 1 ;
  var k = 0 ;
  for (alpha of [0, 0.2, 0.4, 0.8]) {
    let c = alpha / (beta * beta - alpha * alpha) ;  // location of large object from origin
    let lbl = "alpha  = " +  alpha + ",  beta = " + beta ;
     ch2.data.datasets.push (
        { data: getorbit (alpha, beta), 
	  label: lbl, pointRadius: 0, borderColor: colors[k]
	}) ;
     ch2.data.datasets.push (
        { data: [{x: -c, y: 0}, {x: -c, y: 0}],
	  label: "none", pointRadius: 3, pointStyle: "star", borderColor: colors[k]
	}) ;
     k = k + 1 ;
  } // end loop over alpha

     ch2.data.datasets.push (
        { data: [{x: 0, y: 0}], label: "none", type: 'scatter', pointRadius: 2, backgroundColor: 'black'
	}) ;
  ch2.update() ;

} // end plotit

function getorbit(alpha, beta) {
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
