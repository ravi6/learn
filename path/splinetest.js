function splineTest() {
  const xd = [1, 2, 3, 4, 5];
  const yd = [9, 3, 6, 2, 4];
  const spline = new Spline(xd, yd);

  // interpolate 
  var x = [] ; var  y=[]  ;
  for (let i = 0; i < 50; i++) {
   x.push(i*0.1) ; y.push(spline.at(i*0.1)) ;
  };
   var trace1 =  { x: x, y: y, mode: 'lines', name: 'spline',
                   line: {width: 6, color: "rgb(220,100,0)"} };
   var trace2 =  { x: xd, y: yd, mode: 'markers', name: 'data',
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
  Plotly.newPlot(aplot, [trace2, trace1], layout); 

} // end splineTest


function fplot(csvFile) {
  d3.csv(csvFile, function(data){ 
                   consol.log(data);
//                     var x = [] ; var y = [] ;
//		       let row = data[i] ;
//		       x.push( row.x ) ;
//		       y.push( row.y ) ;
 //                      console.log("row", row);
 //                     console.log({x:x,y:y});
                  } );
};
