

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 200, inHeight:200, margin:40});
    //console.log(board);
    
	//comfort range definition
	var maxComfortF = 78
	var minComfortF = 70
	var shr = 3
    
    // setup x
    var xValue = function(d,i) { return i; }; // data -> value // i is the index of the data point
    var xScale = d3.scale.linear()  // value -> display
        .domain([0,23])
        .range((board.dDims.xRange));
    var xMap = function(d,i) { return xScale(xValue(d,i));}; // data -> display
    var xAxis = d3.svg.axis()
        .scale(xScale);
      
    // setup y
    var yScale = d3.scale.linear() // value -> display
        .domain([90,70])
        .range((board.dDims.yRange)); 
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left"); 

    // x-axis
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(0," + (board.dDims.height +10) + ")"
        })
        .call(xAxis)

    // y-axis
    board.g.append("g")
        .attr({
            class: "y axis",
            transform: "translate(-10,0)"
        })
        .call(yAxis)
		
	// line graph, one zone at a time	
	//Comfort Zone
	var yValue = minComfortF;
	var yMap = 140;
	
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = 80
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "grey")
        .attr("stroke-width", th)
        .attr("fill", "none");

	//RecRoom

 	var yValue = function(d) { return d.data.RecRoom.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.RecRoom.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "black")
        .attr("stroke-width", th)
        .attr("fill", "none");
//LivingRoom
	var yValue = function(d) { return d.data.LivingRoom.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.LivingRoom.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "blue")
        .attr("stroke-width", th)
        .attr("fill", "none");
		
	//BR2
	var yValue = function(d) { return d.data.BR2.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.BR2.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "purple")
        .attr("stroke-width", th)
        .attr("fill", "none");

		//BR1
	var yValue = function(d) { return d.data.BR1.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.BR1.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "green")
        .attr("stroke-width", th)
        .attr("fill", "none");

		//Kitchen
	var yValue = function(d) { return d.data.Kitchen.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.Kitchen.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "yellow")
        .attr("stroke-width", th)
        .attr("fill", "none");		

		//DiningRoom
	var yValue = function(d) { return d.data.DiningRoom.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.DiningRoom.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "red")
        .attr("stroke-width", th)
        .attr("fill", "none");

				//DSBath
	var yValue = function(d) { return d.data.DSBath.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.DSBath.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "orange")
        .attr("stroke-width", th)
        .attr("fill", "none");
//Laundry
	var yValue = function(d) { return d.data.Laundry.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.Laundry.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "pink")
        .attr("stroke-width", th)
        .attr("fill", "none");
		
//USBath
	var yValue = function(d) { return d.data.USBath.OperativeTemperature; };
	var yMap = function(d,i) {return yScale(yValue(d,i));};
 
	var lineFunction = d3.svg.line()
		.x(xMap)
		.y(yMap)
		.interpolate("linear");

	var th = dObj.zoneMeta.USBath.size / shr
	board.g.append("path")
        .attr("d", lineFunction(dObj.ticks))
        .attr("stroke", "cyan")
        .attr("stroke-width", th)
        .attr("fill", "none");
        
//    for (var s in dObj.schema){
//        console.log(s);
    
//        var yValue = function(d) { return d.data[s].OperativeTemperature; }; // data -> value
//		var zSize = function(d) {return d.data[s].size;};
        
        // draw dots
 //       board.g.append("g")
 //           .attr("class",s)
 //           .style("fill", "blue")
 //           .selectAll(".dot")
 //               .data(dObj.ticks)
  //              .enter().append("circle")
 //                   .attr({
 //                       class: "dot",
 //                       r: zSize //1.5,
  //                      cx: function(d,i) { return xMap(d,i);} ,
 //                       cy: function(d) { return yScale(yValue(d)); } 
 //                   })
            
 //   }
            
}

