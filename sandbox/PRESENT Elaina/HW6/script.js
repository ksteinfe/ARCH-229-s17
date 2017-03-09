

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board1 = dY.graph.addBoard("#dy-canvas",{inWidth: 500, inHeight:200, margin:40});
	board2 = dY.graph.addBoard("#dy-canvas",{inWidth: 500, inHeight:200, margin:40});
    //console.log(board);
	
	var ctrdGrp1 = board1.g.append("g")
        .attr("transform", "translate(" + board1.dDims.width / 5 + "," + board1.dDims.height / 2 + ")");
		
	var ctrdGrp2 = board1.g.append("g")
        .attr("transform", "translate(" + 4*board1.dDims.width / 5 + "," + board1.dDims.height / 2 + ")");
		
	var ctrdGrp3 = board2.g.append("g")
        .attr("transform", "translate(" + board2.dDims.width / 5 + "," + board2.dDims.height / 2 + ")");
		
	var ctrdGrp4 = board2.g.append("g")
        .attr("transform", "translate(" + 4*board2.dDims.width / 5 + "," + board2.dDims.height / 2 + ")");
    
	//comfort range definition
	var maxComfortF = 76
	var minComfortF = 72
	
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
    var arrRecRoom = dObj.ticks.map(function(d){ return d.data.RecRoom.OperativeTemperature; });
    var arrLivingRoom = dObj.ticks.map(function(d){ return d.data.LivingRoom.OperativeTemperature; });
    var arrBR2 = dObj.ticks.map(function(d){ return d.data.BR2.OperativeTemperature; });
	var arrBR1 = dObj.ticks.map(function(d){ return d.data.BR1.OperativeTemperature; });
	var arrKitchen = dObj.ticks.map(function(d){ return d.data.Kitchen.OperativeTemperature; });
	var arrDiningRoom = dObj.ticks.map(function(d){ return d.data.DiningRoom.OperativeTemperature; });
	var arrDSBath = dObj.ticks.map(function(d){ return d.data.DSBath.OperativeTemperature; });
	var arrLaundry = dObj.ticks.map(function(d){ return d.data.Laundry.OperativeTemperature; });
	var arrUSBath = dObj.ticks.map(function(d){ return d.data.USBath.OperativeTemperature; }); 
	var arrTotal = dObj.ticks.map(function(d){ return d.data.Total.OperativeTemperature; }); 
	
	var roomSize = dObj.ticks.map(function(d){ return d.zoneMeta.size;});
	
	// Color according to temperature. 
	var colorScale = d3.scale.linear()
		.domain([60, minComfortF, maxComfortF, 88])
		.range(["#2c7bb6", "#f5f5dc", "#f5f5dc", "#d7191c"])
		.interpolate(d3.interpolateHcl);
	
	//easy color = effectively random
	//	var color = d3.scale.category10();

	//labels
	var labs = [
        { name: "Midnight", value: 10 },
        { name: "1 AM", value: 10 },
        { name: "2 AM", value: 10 },
        { name: "3 AM", value: 10 },
        { name: "4 AM", value: 10 },
        { name: "5 AM", value: 10 },
        { name: "6 AM", value: 10 },
        { name: "7 AM", value: 10 },
        { name: "8 AM", value: 10 },
        { name: "9 AM", value: 10 },
        { name: "10 AM", value: 10 },
        { name: "11 AM", value: 10 },
		{ name: "Noon", value: 10 },
        { name: "1 PM", value: 10 },
        { name: "2 PM", value: 10 },
        { name: "3 PM", value: 10 },
        { name: "4 PM", value: 10 },
        { name: "5 PM", value: 10 },
        { name: "6 PM", value: 10 },
        { name: "7 PM", value: 10 },
        { name: "8 PM", value: 10 },
        { name: "9 PM", value: 10 },
        { name: "10 PM", value: 10 },
        { name: "11 PM", value: 10 },
    ];
	
/*	// pie chart for labels. 
    var pie = d3.layout.pie()
       // .startAngle(0 * Math.PI / 180)
       // .endAngle(0 * Math.PI / 180 + 2 * Math.PI)
        .value(function (d) { return d.value; })
        .padAngle(.01)
        .sort(null);
		
	svg.selectAll(".donutArcSlices")
			.data(pie(labs))
		  .enter().append("path")
			.attr("class", "donutArcSlices")
			.attr("d", arc)
			.each(function (d, i) {
				var firstArcSection = /(^.+?)L/;
				var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
				newArc = newArc.replace(/,/g, " ");
				svg.append("path")
					.attr("class", "hiddenDonutArcs")
					.attr("id", "donutArc" + i)
					.attr("d", newArc)
					.style("fill", "none");
			});
    svg.selectAll(".donutText")
        .data(labs)
       .enter().append("text")
        //.attr("class", "donutText")
        //.attr("dy", -13)
       .append("textPath")
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .attr("xlink:href", function (d, i) { return "#donutArc" + i; })
        .text(function (d) { return d.name; });
	
    // write month on top of svg
    var fontSize = 15;
	var width = 2;
	var height = 3;
	
    svg.selectAll("text-top")
        .data(labs)
        .enter().append("text")
        .attr("x", function(d, i) {
            return (i + 2.2) * width - fontSize * 2.2;
        })
        .attr("y", function(d, i) {
            return 1.1 * height;
        })
        .attr("fill", "#d7191c")
        //.attr("font-family", "sans-serif")
        .text(function (d) {
            return labs["" + d];
        });
*/
	//simpleArcs
	
	//RecRoom
    var arc = d3.svg.arc()
        .innerRadius(90)
        .outerRadius(100)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d,i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrRecRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
		
	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i].name; })
			.attr("x", function(d, i) {
				return (i-30);
			})
			.attr("y", function(d, i) {
				return (i-108);
			})
			.attr("fill", "#f4a460"); 

	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+6].name; })
			.attr("x", function(d, i) {
				return (i+102);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "#f4a460"); 	

	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+12].name; })
			.attr("x", function(d, i) {
				return (i-20);
			})
			.attr("y", function(d, i) {
				return (i+116);
			})
			.attr("fill", "#f4a460"); 
			
	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+18].name; })
			.attr("x", function(d, i) {
				return (i-140);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "#f4a460"); 		
			
	//LivingRoom		
	var arc = d3.svg.arc()
        .innerRadius(80)
        .outerRadius(90)
        .startAngle(function(d,i) {return i*(pi/12)+gap ;})
        .endAngle(function(d,i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrLivingRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);
			
	//BR2		
	var arc = d3.svg.arc()
        .innerRadius(70)
        .outerRadius(80)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrBR2)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	//BR1		
	var arc = d3.svg.arc()
        .innerRadius(60)
        .outerRadius(70)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrBR1)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	//kitchen
	var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(60)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrKitchen)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)

	//DiningRoom
	var arc = d3.svg.arc()
        .innerRadius(40)
        .outerRadius(50)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrDiningRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	//Total (Whole House)
	var arc = d3.svg.arc()
        .innerRadius(1)
        .outerRadius(32)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(1);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrTotal)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
 /*   ctrdGrp.append("g").selectAll("path")
        .data(arrBR2)
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
            


