 google.charts.load('current', {'packages':['corechart']});
 var chartLayout ;
 var hChartReady = function(){ // define handler
  chartLayout = chart.getChartLayoutInterface();
};
var defoptions = {title:  'Plotting Series with Google',
                   width:      600,
                   height:     300,
		   hAxis: {title: 'Xaxis'},
		   vAxis: {title: 'Yaxis'},
	           focusTarget: 'category', // Enable all Y's on tooltip 
		   interpolateNulls: true,
		       // legend: 'none',   
		       series: {
		    	    //  0: {curveType: 'function', pointSize: 10},
		    	    //  1: {curveType: 'scatter', pointSize: 10},
		    	      2: {curveType: 'function'},  // without points smooth curve
			     }
	            }; // end options

function gPlot(figID, data) {
    // data = ([ ["X","Y2"], [1, 8], [3, 1], [4, 3]]) ;
    var dt = google.visualization.arrayToDataTable(data);
    fig =  document.getElementById(figID);
    var chart = new google.visualization.LineChart(figIDg);
    chart.draw(jd, options);
} // Draw Multi end
