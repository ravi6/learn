function plotTraj() {

 var traces=Array(4) ;
 var params = {alpha: 0.5,  beta: [10, 2, 1, 0.45]} ;

  for (var i=0 ; i < 4 ; i++) {
    var data = orbit (params.alpha, params.beta[i]) ;
    traces[i] = {
      r: data.r,
      theta: data.theta,
      mode: 'lines',
      line: {color: 'blue'},
      name: 'Subcardioid',
      type: 'scatterpolar' };
  }

  var layout = {
    grid: {rows: 2, columns: 2 },
  };

  var a = traces[0] ; var b = traces[1] ;
  Plotly.newPlot('plotly', [b,b,b,b] );

}

const config = {
  type: 'scatter',
  data: data,
  options: {
    scales: {
      x: { type: 'linear', position: 'bottom' }
    }
  } // end options
};

function orbit(alpha, beta) {
  // return descritized orbit data points
  // for specified parameters
   var theta = [] ;  var  r = [] ;
   for (var i=0 ; i < 100 ; i++) {
     let phi = (i*2*Math.PI/100) ;
     theta.push (phi) ;
     r.push (1.0 / (beta + alpha * Math.cos(phi))) ;
   }
  return ({theta: theta , r:r}) ;
}
plotTraj() ;
