

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 200, inHeight:200, margin:40});
    //console.log(board);
	
	var ctrdGrp = board.g.append("g")
        .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ")");
    
	//comfort range definition
	var maxComfortF = 78
	var minComfortF = 70
	
	//layout parameters
	var gap = 0.02
	var spacing = 0.3
	var OS = 100
	var radius = 25
	var pi = Math.PI
//	var startAngles = [gap, pi/12+gap, 2*(pi/12)+ gap, 3*(pi/12)+gap, 4*(pi/12)+gap, 5*(pi/12)+gap, 6*(pi/12)+gap, 7*(pi/12)+gap, 8*(pi/12)+gap, 9*(pi/12)+gap, 10*(pi/12)+gap, 11*(pi/12)+gap, 12*(pi/12)+gap, 13*(pi/12)+gap, 14*(pi/12)+gap, 15*(pi/12)+gap, 16*(pi/12)+gap, 17*(pi/12)+gap, 18*(pi/12)+gap, 19*(pi/12)+gap, 20*(pi/12)+gap, 21*(pi/12)+gap, 22*(pi/12)+gap, 23*(pi/12)+gap]
//	var endAngles = [pi/12, 2*(pi/12), 3*(pi/12), 4*(pi/12), 5*(pi/12), 6*(pi/12), 7*(pi/12), 8*(pi/12), 9*(pi/12), 10*(pi/12), 11*(pi/12), 12*(pi/12), 13*(pi/12), 14*(pi/12), 15*(pi/12), 16*(pi/12), 17*(pi/12), 18*(pi/12), 19*(pi/12), 20*(pi/12), 21*(pi/12), 22*(pi/12), 23*(pi/12)]
	
	//data
	var dummy = [71,72,73,74,75,76,77,78,78,89,90,91,79,78,75,72,70,60,40,40,38, 60, 70, 71]
    
    // by the way, here's how to extract data for a particular zone given your data structure
    var arrBR1 = dObj.ticks.map(function(d){ return d.data.BR1.OperativeTemperature; });
    var arrBR2 = dObj.ticks.map(function(d){ return d.data.BR2.OperativeTemperature; });
    var arrDSBath = dObj.ticks.map(function(d){ return d.data.DSBath.OperativeTemperature; });
	    
	// Color according to temperature. 
	var colorScale = d3.scale.linear()
		.domain([40, 74, 100])
		.range(["#2c7bb6", "#ffff8c", "#d7191c"])
		.interpolate(d3.interpolateHcl);
	
	//easy color = effectively random
//	var color = d3.scale.category10();

	//simpleArcs
    var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(70)
        .startAngle(function(d) {return d*(pi/12)+gap ;})
        .endAngle(function(d) {return (d+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp.append("g").selectAll("path")
        .data(dummy)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);
    
    /*
    REPLCAED BY KYLE'S CODE ABOVE
    You're mixing approaches here. d3 wants you to use the select->data->enter->append chain of methods (as above) to associate data with graphics on the page. In some situations, you might instead use something like a loop. In the code below, you appear to be trying to do both at the same time. 
	for (var d=0; d<24; d++){
		var arc = d3.svg.arc()
			.innerRadius(50)
			.outerRadius(70)
			.startAngle(function(d) {return d*(pi/12)+gap ;})
			.endAngle(function(d) {return (d+1)*(pi/12);})
			.cornerRadius(2);
	
	//draw arc paths. 
		ctrdGrp.append("path") 
			.attr("fill", function(d) {return colorScale(dummy[d]);})
			.attr("d", arc);
	}
    */

//	for (var s in dObj.schema){
//        console.log(s);
//	}
 //       var yValue = function(d) { return d.data[s].OperativeTemperature; }; // data -> value
 //       var color = function(d) {return colorScale(yValue);};
		
        // draw dots
//        board.g.append("path")
 //           .attr("class","arc-body") } 
                    	
	
	
//	var field = svg.selectAll("g")
//		.data(OpTemps)
//		.enter().append("g");

//	field.append("path")
//		.attr("class", "arc-body");
	
	

		
		//.style("fill", function (d) { return colorScale(d.averageOf("DryBulbTemp")); });
}
            


