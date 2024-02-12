function fitSpline2D (data, np) {
//  fits spline to a 2d curve and returns data set
//  n equidistant points from x[0] to x[end]
//  Assuming x is monotonically increasing

  // interpolate 
  const spline = new Spline (data.x, data.y);
  var x = [] ; var  y = []  ;
  var dx = (data.x[data.x.length-1] - data.x[0]) / (np - 1) ;
  for (let i = 0; i < np; i++) {
    let xp = data.x[0] + dx * i ;
    x.push (xp) ; y.push (spline.at(xp)) ;
  };
  return ({x: x, y: y}) ;
} // end fitSpline2D


function splineTest () {
   var data = { x: [1, 2, 3, 4, 5],
                y: [9, 3, 6, 2, 4] 
              };

   var fit = fitSplie2D (data, 50) ;
   var trace1 =  { x: fit.x, y: fit.y, mode: 'lines', name: 'spline',
                   line: {width: 6, color: "rgb(220,100,0)"} };
   var trace2 =  { x: data.x, y: data.y , mode: 'markers', name: 'data',
                    marker: {size: 29, color: "rgb(111, 22, 100)" } };

  var layout = {
    xaxis: {
    title: 'xval', titlefont: {size:40, color:'rgb(0,0,254)'},
    showgrid: true, mirror: 'ticks',
    gridcolor: '#bdbdbd', gridwidth: 2,
    tickfont: {size:30}
  },
    yaxis: {
    title: 'yval', titlefont: {size:40, color:'rgb(0,0,254)'},
    showgrid: true, mirror: 'ticks',
    gridcolor: '#bdbdbd', gridwidth: 2,
    tickfont: {size:30}
  }
}; // end layout

  var aplot = document.getElementById("plotter");
  Plotly.newPlot (aplot, [trace2, trace1], layout); 

} // end splineTest


function  csvRead (csvFile) {
   var x = [] ; var y = [] ;
	function cbData (x, y) {
		return ( function (data) {
			      x.push (data.x) ;
			      y.push (data.y) ; 
			      } ) ;
		 }; // call back function for data
   d3.csv ( csvFile, cbData (x, y) )  ;
   console.log (x, y);
   return ( {x: x, y: y} ) ;
} // end csvRead


function genHelix () {
  // Generate helix using parametric eq
  var t = []  ; var x = [] ; var y = [] ; var z = [] ;

  var dt = 0.4 ;
  for (i = 0; i < 30 ; i++) {
     let ct = i * dt ;
     x.push ( Math.sin(ct) );
     y.push ( Math.cos(ct) );
     z.push ( 2 * ct ) ;
     t.push (ct) ;
  } 
   return ( {t: t, x: x, y: y, z: z} ) ; 
}// return helix curve data

function arcLen (data) {
  // returns arclength continuation parameter
  // helps fit complex 3d curves with splines
  // data contains points in the sequence along the curve

    var x = data.x ;
    var y = data.y ;
    var z = data.z ;

   // Here p is cumulative lenght of the curve 
   // as one moves along from its origin
    var p = [] ;
    p.push (0)  ;
    for (i = 1 ; i < x.length ; i++) {
      var d = p[i-1] + Math.sqrt ( Math.pow (x[i] - x[i-1], 2) +
	                          Math.pow (y[i] - y[i-1], 2) +
	                          Math.pow (z[i] - z[i-1], 2) ) ;
      p.push(d) ;
    }
    return (p) ;
} // end arcLen

function dist (p1, p2) {
  // Linear distance between two points
  return ( Math.sqrt ( Math.pow ((p1.x - p2.x), 2) +
                       Math.pow ((p1.y - p2.y), 2) +
                       Math.pow ((p1.z - p2.z), 2) ) );
}
