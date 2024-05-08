function plotTraj() {

 var traces = [] ;
 var params = {alpha: 0.5,  beta: [10, 2, 1, 0.45]} ;

  for (i=0 ; i < 4 ; i++) {
    console.log(params.beta[i]);
    var data = orbit (params.alpha, params.beta[i]) ;
    traces.push (  {
      r: data.r,
      theta: data.theta,
      mode: 'lines',
      line: {color: 'blue'},
      name: 'Subcardioid',
      type: 'scatterpolar' });
  }


  var layout = {
    grid: {rows: 2, columns: 2, pattern: 'independent'},
    autosize: true
  };

  Plotly.newPlot('plotly', traces, layout);
}


function orbit(alpha, beta) {
  // return descritized orbit data points
  // for specified parameters
   var theta = [] ;  var  r = [] ;
   for (i=0 ; i < 100 ; i++) {
     let phi = (i*2*Math.pi/100) ;
     theta.push (phi) ;
     r.push (1.0 / (beta + alpha * Math.cos(phi))) ;
   }
  return ({theta: theta , r:r}) ;
}
plotTraj() ;
