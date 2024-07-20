class Beta {
// Beta Distribution object/ 
 
 constructor() {
   this.series = [] ;
 }

pdf(a, b) { // Returns pdfTable
   var data = {x: [], p: []};
   var n = 101 ;
   for (let i = 0 ; i < n ; i++) {
   	    let x = i / (n-1) ;
    	data.p.push(jStat.beta.pdf(x, a, b)) ;
    	data.x.push(x);
   }
   return(data);
} // end pdf
 
plot (fig, a, b) { 
  // adds pdf trend at each call
     var data = this.pdf(a, b);	
     this.series.push({x:    data.x,
                       y:    data.p,
                       mode: 'lines',
                       name: sprintf("a=%d b=%d", a, b) });
                
     var layout = { title:      'Beta Distribution',               
                    showlegend: true,
               	    xaxis: {title: {text: "x"}},
	            yaxis: {title: {text: "pdf"}}, 
                 autosize: true
                  };

     var config = { scrollZoom: false,
                    displayModeBar: false
                  }
     Plotly.newPlot(fig, this.series, layout, config);     
} // end plot

clearPlot() {this.series = [] ;}

} // end betaPDF class
