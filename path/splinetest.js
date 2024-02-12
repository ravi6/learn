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
 var x = [] ; var y = [] ;
 d3.csv(csvFile, getData(x,y))  ;
 console.log(x,y);
}

function getData(x,y) {
    return ( function (data) {
               x.push(data.x) ;
               y.push(data.y) ; 
              } ) ;
} // getData
