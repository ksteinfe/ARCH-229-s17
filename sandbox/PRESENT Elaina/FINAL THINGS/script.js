

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
	var minComfortF = 66
	
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
	//Base House, Summer
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

	//Final House, Summer
	var arrRecRoom_SF = dObj.ticks.map(function(d){ return d.data.RecRoom_SF.OperativeTemperature; });
    var arrLivingRoom_SF = dObj.ticks.map(function(d){ return d.data.LivingRoom_SF.OperativeTemperature; });
    var arrBR2_SF = dObj.ticks.map(function(d){ return d.data.BR2_SF.OperativeTemperature; });
	var arrBR1_SF = dObj.ticks.map(function(d){ return d.data.BR1_SF.OperativeTemperature; });
	var arrKitchen_SF = dObj.ticks.map(function(d){ return d.data.Kitchen_SF.OperativeTemperature; });
	var arrDiningRoom_SF = dObj.ticks.map(function(d){ return d.data.DiningRoom_SF.OperativeTemperature; });
	var arrDSBath_SF = dObj.ticks.map(function(d){ return d.data.DSBath_SF.OperativeTemperature; });
	var arrLaundry_SF = dObj.ticks.map(function(d){ return d.data.Laundry_SF.OperativeTemperature; });
	var arrUSBath_SF = dObj.ticks.map(function(d){ return d.data.USBath_SF.OperativeTemperature; });
	var arrTotal_SF = dObj.ticks.map(function(d){ return d.data.Total_SF.OperativeTemperature; }); 
	
	//Base House, Winter
	var arrRecRoom_WB = dObj.ticks.map(function(d){ return d.data.RecRoom_WB.OperativeTemperature; });
    var arrLivingRoom_WB = dObj.ticks.map(function(d){ return d.data.LivingRoom_WB.OperativeTemperature; });
    var arrBR2_WB = dObj.ticks.map(function(d){ return d.data.BR2_WB.OperativeTemperature; });
	var arrBR1_WB = dObj.ticks.map(function(d){ return d.data.BR1_WB.OperativeTemperature; });
	var arrKitchen_WB = dObj.ticks.map(function(d){ return d.data.Kitchen_WB.OperativeTemperature; });
	var arrDiningRoom_WB = dObj.ticks.map(function(d){ return d.data.DiningRoom_WB.OperativeTemperature; });
	var arrDSBath_WB = dObj.ticks.map(function(d){ return d.data.DSBath_WB.OperativeTemperature; });
	var arrLaundry_WB = dObj.ticks.map(function(d){ return d.data.Laundry_WB.OperativeTemperature; });
	var arrUSBath_WB = dObj.ticks.map(function(d){ return d.data.USBath_WB.OperativeTemperature; });
	var arrTotal_WB = dObj.ticks.map(function(d){ return d.data.Total_WB.OperativeTemperature; }); 

	//Final House, Winter
	var arrRecRoom_WF = dObj.ticks.map(function(d){ return d.data.RecRoom_WF.OperativeTemperature; });
    var arrLivingRoom_WF = dObj.ticks.map(function(d){ return d.data.LivingRoom_WF.OperativeTemperature; });
    var arrBR2_WF = dObj.ticks.map(function(d){ return d.data.BR2_WF.OperativeTemperature; });
	var arrBR1_WF = dObj.ticks.map(function(d){ return d.data.BR1_WF.OperativeTemperature; });
	var arrKitchen_WF = dObj.ticks.map(function(d){ return d.data.Kitchen_WF.OperativeTemperature; });
	var arrDiningRoom_WF = dObj.ticks.map(function(d){ return d.data.DiningRoom_WF.OperativeTemperature; });
	var arrDSBath_WF = dObj.ticks.map(function(d){ return d.data.DSBath_WF.OperativeTemperature; });
	var arrLaundry_WF = dObj.ticks.map(function(d){ return d.data.Laundry_WF.OperativeTemperature; });
	var arrUSBath_WF = dObj.ticks.map(function(d){ return d.data.USBath_WF.OperativeTemperature; });
	var arrTotal_WF = dObj.ticks.map(function(d){ return d.data.Total_WF.OperativeTemperature; }); 
	
	
//	var roomSize = dObj.ticks.map(function(d){ return d.zoneMeta.size;}); sadface
	
	// Color according to temperature. 
	var colorScale = d3.scale.linear()
		.domain([55, minComfortF, maxComfortF, 85])
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
	
	
	//labels
	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i].name; })
			.attr("x", function(d, i) {
				return (i-30);
			})
			.attr("y", function(d, i) {
				return (i-108);
			})
			.attr("fill", "grey"); 

	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+6].name; })
			.attr("x", function(d, i) {
				return (i+102);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 	

	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+12].name; })
			.attr("x", function(d, i) {
				return (i-20);
			})
			.attr("y", function(d, i) {
				return (i+116);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp1.append("text")
			.text(function (d,i) { return labs[i+18].name; })
			.attr("x", function(d, i) {
				return (i-140);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp2.append("text")
			.text(function (d,i) { return labs[i].name; })
			.attr("x", function(d, i) {
				return (i-30);
			})
			.attr("y", function(d, i) {
				return (i-108);
			})
			.attr("fill", "grey"); 

	ctrdGrp2.append("text")
			.text(function (d,i) { return labs[i+6].name; })
			.attr("x", function(d, i) {
				return (i+102);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 	

	ctrdGrp2.append("text")
			.text(function (d,i) { return labs[i+12].name; })
			.attr("x", function(d, i) {
				return (i-20);
			})
			.attr("y", function(d, i) {
				return (i+116);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp2.append("text")
			.text(function (d,i) { return labs[i+18].name; })
			.attr("x", function(d, i) {
				return (i-140);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp3.append("text")
			.text(function (d,i) { return labs[i].name; })
			.attr("x", function(d, i) {
				return (i-30);
			})
			.attr("y", function(d, i) {
				return (i-108);
			})
			.attr("fill", "grey"); 

	ctrdGrp3.append("text")
			.text(function (d,i) { return labs[i+6].name; })
			.attr("x", function(d, i) {
				return (i+102);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 	

	ctrdGrp3.append("text")
			.text(function (d,i) { return labs[i+12].name; })
			.attr("x", function(d, i) {
				return (i-20);
			})
			.attr("y", function(d, i) {
				return (i+116);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp3.append("text")
			.text(function (d,i) { return labs[i+18].name; })
			.attr("x", function(d, i) {
				return (i-140);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp4.append("text")
			.text(function (d,i) { return labs[i].name; })
			.attr("x", function(d, i) {
				return (i-30);
			})
			.attr("y", function(d, i) {
				return (i-108);
			})
			.attr("fill", "grey"); 

	ctrdGrp4.append("text")
			.text(function (d,i) { return labs[i+6].name; })
			.attr("x", function(d, i) {
				return (i+102);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 	

	ctrdGrp4.append("text")
			.text(function (d,i) { return labs[i+12].name; })
			.attr("x", function(d, i) {
				return (i-20);
			})
			.attr("y", function(d, i) {
				return (i+116);
			})
			.attr("fill", "grey"); 
			
	ctrdGrp4.append("text")
			.text(function (d,i) { return labs[i+18].name; })
			.attr("x", function(d, i) {
				return (i-140);
			})
			.attr("y", function(d, i) {
				return (i+5);
			})
			.attr("fill", "grey"); 

	//simpleArcs
	
	//RecRoom
    var arc = d3.svg.arc()
        .innerRadius(80.88613)
        .outerRadius(100)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d,i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrRecRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp2.append("g").selectAll("path")
        .data(arrRecRoom_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	
	ctrdGrp3.append("g").selectAll("path")
        .data(arrRecRoom_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)

	ctrdGrp4.append("g").selectAll("path")
        .data(arrRecRoom_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
		
		
			
	//LivingRoom		
	var arc = d3.svg.arc()
        .innerRadius(70.75209)
        .outerRadius(80.88613)
        .startAngle(function(d,i) {return i*(pi/12)+gap ;})
        .endAngle(function(d,i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrLivingRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);

    ctrdGrp2.append("g").selectAll("path")
        .data(arrLivingRoom_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);	

    ctrdGrp3.append("g").selectAll("path")
        .data(arrLivingRoom_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);

    ctrdGrp4.append("g").selectAll("path")
        .data(arrLivingRoom_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc);
			
	//BR2		
	var arc = d3.svg.arc()
        .innerRadius(63.21958)
        .outerRadius(70.75209)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrBR2)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp2.append("g").selectAll("path")
        .data(arrBR2_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp3.append("g").selectAll("path")
        .data(arrBR2_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp4.append("g").selectAll("path")
        .data(arrBR2_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	//BR1		
	var arc = d3.svg.arc()
        .innerRadius(56.12269)
        .outerRadius(63.21958)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrBR1)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp2.append("g").selectAll("path")
        .data(arrBR1_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	ctrdGrp3.append("g").selectAll("path")
        .data(arrBR1_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)

	ctrdGrp4.append("g").selectAll("path")
        .data(arrBR1_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	//kitchen
	var arc = d3.svg.arc()
        .innerRadius(48.59865)
        .outerRadius(56.12269)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrKitchen)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp2.append("g").selectAll("path")
        .data(arrKitchen_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp3.append("g").selectAll("path")
        .data(arrKitchen_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp4.append("g").selectAll("path")
        .data(arrKitchen_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)

	//DiningRoom
	var arc = d3.svg.arc()
        .innerRadius(40)
        .outerRadius(48.59865)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(2);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrDiningRoom)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	
	ctrdGrp2.append("g").selectAll("path")
        .data(arrDiningRoom_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp3.append("g").selectAll("path")
        .data(arrDiningRoom_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp4.append("g").selectAll("path")
        .data(arrDiningRoom_WF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)	
	
	//Total (Whole House)
	var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(32)
        .startAngle(function(d, i) {return i*(pi/12)+gap ;})
        .endAngle(function(d, i) {return (i+1)*(pi/12);})
        .cornerRadius(1);    
    
    ctrdGrp1.append("g").selectAll("path")
        .data(arrTotal)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp2.append("g").selectAll("path")
        .data(arrTotal_SF)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
			
	ctrdGrp3.append("g").selectAll("path")
        .data(arrTotal_WB)
        .enter().append("path")
            .attr("fill", function(d) {return colorScale(d);})
            .attr("d", arc)
	
	ctrdGrp4.append("g").selectAll("path")
        .data(arrDiningRoom_WF)
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
            


