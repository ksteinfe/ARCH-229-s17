


function onDataLoaded(dObj) {
    //console.log(dObj)
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.DryBulbTemp = tick.hourOfDay();
        //tick.data.EPW.WindSpd = 10;
        //if (tick.data.EPW.DryBulbTemp < 0) console.log(tick);
    }
    
    
    // summary information for each day of the year
    var dSum = dObj.dailySummary();
    console.log(dSum);
    // I used this to manipulate the incoming data to test validity of graph
    for (var st in dSum) {
        stick = dSum[st];
        //stick.data.EPW.DryBulbTemp.max = 30;
        //stick.data.EPW.DryBulbTemp.min = -20;
        //stick.data.EPW.DryBulbTemp.average = 20;
    }    
    
    var originX = 0;
    var originY = 0;

    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    var board = dY.graph.addBoard("#dy-canvas",{inWidth: 400, inHeight:400, margin:50});
    var width = board.dDims.width;
    var height = board.dDims.height;
    
    var svg = board.g.append("g").attr("class", "wrapper")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");


    
   // Data and color
    
    var monthsData = [
        { name: "Janurary", value: 10 },
        { name: "February", value: 10 },
        { name: "March", value: 10 },
        { name: "April", value: 10 },
        { name: "May", value: 10 },
        { name: "June", value: 10 },
        { name: "July", value: 10 },
        { name: "August", value: 10 },
        { name: "September", value: 10 },
        { name: "October", value: 10 },
        { name: "November", value: 10 },
        { name: "December", value: 10 },
    ];

    //Months Bar color 
    var colorScale = d3.scale.linear()
       .domain([1, 5, 10])
       .range(["#d8faef", "#e3fdf5", "#e6fbf5"])
       .interpolate(d3.interpolateHcl);

    var group = svg.append("g");
    var rZeroCircle = width * 0.4 / 2;
    var rOuterCircle = width * 0.7 / 2 + 5;

    //arc function   
    //for text
    var arc = d3.svg.arc()
        .innerRadius(rZeroCircle+20)
        .outerRadius(rZeroCircle + 38);

    var table = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        r: width * 0.8 / 2,
        fill: "none",
        stroke: "black"
    });

   

    var outerCircle = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        opacity: 1,
        r: rZeroCircle,
        fill: "none",
        stroke: "black"
    });
    
    

    var pointOnOuterCircle = svg.append("circle").attr({
        cx: barOriginX,
        cy: barOriginY,
        opacity: 0,
        r: 5,
        fill: "red"
    });
    var barHeight = 20;
    var barWidth = 2 * rOuterCircle * Math.PI / 365;
    for (var i = 0; i < 365; i++) {
        var barOriginX = originX + ((rZeroCircle) * Math.sin(i));
        var barOriginY = originY - ((rZeroCircle) * Math.cos(i));
        var barOuterOriginX = originX + ((rOuterCircle) * Math.sin(i));
        var barOuterOriginy = originY - ((rOuterCircle) * Math.cos(i));

        //draw circle instead of bar, this is the zero degree axis circle! 
        var bar = svg.append("circle").attr({
            cx: barOriginX,
            cy: barOriginY,
            r: (Math.PI) * (rZeroCircle) / 365,
            opacity: 1,
            fill: "#002aff",
            stroke: "none"
        });
        var outbar = svg.append("circle").attr({
            cx: barOuterOriginX,
            cy: barOuterOriginy,
            r: (Math.PI) * (rOuterCircle) / 365,
            opacity: 1,
            fill: "#00c2f3",
            stroke: "none"
        });
    }
    

   // pie chart for months. 
    var pie = d3.layout.pie()
       // .startAngle(0 * Math.PI / 180)
       // .endAngle(0 * Math.PI / 180 + 2 * Math.PI)
        .value(function (d) { return d.value; })
        .padAngle(.01)
        .sort(null);

   
   //  Donut Chart
    

    svg.selectAll(".donutArcSlices")
			.data(pie(monthsData))
		  .enter().append("path")
			.attr("class", "donutArcSlices")
			.attr("d", arc)
			.each(function (d, i) {
                ///////////////////////////BELOW IS THE TUTORIAL//////////////////////////////////////////
			    //A regular expression that captures all in between the start of a string (denoted by ^) and a capital letter L
			    //The letter L denotes the start of a line segment
			    //The "all in between" is denoted by the .+? 
			    //where the . is a regular expression for "match any single character except the newline character"
			    //the + means "match the preceding expression 1 or more times" (thus any single character 1 or more times)
			    //the ? has to be added to make sure that it stops at the first L it finds, not the last L 
			    //It thus makes sure that the idea of ^.*L matches the fewest possible characters
			    //For more information on regular expressions see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
			    var firstArcSection = /(^.+?)L/;

			    //Grab everything up to the first Line statement
			    //The [1] gives back the expression between the () (thus not the L as well) which is exactly the arc statement
			    var newArc = firstArcSection.exec(d3.select(this).attr("d"))[1];
			    //Replace all the comma's so that IE can handle it -_-
			    //The g after the / is a modifier that "find all matches rather than stopping after the first match"
			    newArc = newArc.replace(/,/g, " ");

			    //Create a new invisible arc that the text can flow along
			    svg.append("path")
					.attr("class", "hiddenDonutArcs")
					.attr("id", "donutArc" + i)
					.attr("d", newArc)
					.style("fill", "none");
			});

   
    svg.selectAll(".donutText")
        .data(monthsData)
       .enter().append("text")
        .attr("class", "donutText")
        .attr("dy", -13)
       .append("textPath")
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .attr("xlink:href", function (d, i) { return "#donutArc" + i; })
        .text(function (d) { return d.name; });


//TEMPERATURE

var outerRadius = rZeroCircle*1.6,
	innerRadius = outerRadius * 0.4;

// Color according to mean temperature. 
var colorScale = d3.scale.linear()
	.domain([-15, 7.5, 30])
	.range(["#2c7bb6", "#ffff8c", "#d7191c"])
	.interpolate(d3.interpolateHcl);

//bar height
var barScale = d3.scale.linear()
	.range([innerRadius, outerRadius])
	.domain([-15,30]); 

var angle = d3.scale.linear()
	.range([-180, 180])
	.domain([0,364]);


//  Axes

//Wrapper for the bars and to position it downward
var barWrapper = svg.append("g")
	.attr("transform", "translate(" + 0 + "," + 0 + ")");
	
//Draw gridlines below the bars
var axes = barWrapper.selectAll(".gridCircles")
 	.data([-20,0,30])
 	.enter().append("g");
//Draw the circles
axes.append("circle")
 	.attr("class", "axisCircles")
 	.attr("r", function (d) { return barScale(d); })
    .attr("fill", "none");

//Draw the axis labels
axes.append("text")
	.attr("class", "axisText")
	.attr("y", function(d) { return barScale(d); })
	.attr("dy", "0.3em")
	.text(function(d) { return d + "�C"});



// Draw bars 

//Draw a bar per day were the height is the difference between the minimum and maximum temperature
//And the color is based on the mean temperature
barWrapper.selectAll(".tempBar")
 	.data(dSum)
 	.enter().append("rect")
 	.attr("class", "tempBar")
 	.attr("transform", function(d,i) { return "rotate(" + (angle(i)) + ")"; })
 	.attr("width", 1.5)
	.attr("height", function(d,i) { return barScale(d.maxOf("DryBulbTemp")) - barScale(d.minOf("DryBulbTemp")); })
 	.attr("x", -0.75)
 	.attr("y", function(d,i) {return barScale(d.minOf("DryBulbTemp")); })
 	.style("fill", function (d) { return colorScale(d.averageOf("DryBulbTemp")); });





    //// //draw wind circle


for (var t in dObj.ticks) {
    tick = dObj.ticks[t];
    //tick.data.EPW.WindDir = 45;
    //tick.data.EPW.WindSpd = 10;
    
    //if (tick.dayOfYear() < 10) tick.data.EPW.WindSpd = 1;
}


var ctrdGrp = board.g.append("g")
    .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ") rotate(-90)");

var textPadding = 1;
var ctrOffset = 5;
var radius = 30
var radValue = function (d) { return d.valueOf("WindSpd"); }; // data -> value
var radScale = d3.scale.linear()  // value -> display
    //.domain(dObj.metaOf("WindSpd").domain)
    .domain([0, 5])
    .range([ctrOffset, radius]);
var radMap = function (d) { return radScale(radValue(d)); }; // data -> display

    // setup angle
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
var angValue = function (d) { return d.dayOfYear(); }; // data -> value
var angScale = d3.scale.linear() // value -> display
    .domain([0, 364])
    .range([0, 2 * Math.PI]);
var angMap = function (d) { return angScale(angValue(d)); }; // data -> display

    // draw dots
ctrdGrp.append("g").selectAll(".dot")
    .data(dObj.ticks)
    .enter().append("circle")
        .attr({
            class: "dot",
            r: 1.5,
            cx: function (d) { return (radMap(d) * Math.cos(angMap(d))); },
            cy: function (d) { return (radMap(d) * Math.sin(angMap(d))); }
        })
       

/*
//var radAxisGroups = ctrdGrp.append("g") // radAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to a value along the radial axis
//   .attr("class", "radius axis")
//  .selectAll("g")
//  .data(radScale.ticks(4))
//    // bind a rough number of values of the radScale to this group, slicing the first one off to avoid having a value at the center
//  .enter().append("g");

radAxisGroups.append("circle") // append a circle to each
    .attr("r", radScale)
    .attr("fill", "white");

//radAxisGroups.append("line") // append a line to each 
//    .attr("x2", -(board.bDims.margin.bottom / 2 + board.dDims.height / 2))
//    .attr("y1", radScale)
//    .attr("y2", radScale);

//radAxisGroups.append("text") // append some text to each
//    .attr("x", function (d) { return radScale(d); }) // d in this case is a tick value along the radScale axis
//    .text(function (d) { return d; })
//    .attr("transform", "rotate(90) translate(0, " + (board.bDims.margin.bottom / 2 + board.dDims.height / 2) + ")") // rotate to horizontal, translate to bottom of board
//    .style("text-anchor", "middle");
*/

    /*
    should have done this instead
    http://stackoverflow.com/questions/11254806/interpolate-line-to-make-a-half-circle-arc-in-d3    
    var arc = d3.svg.arc() // arcs are drawn by a different starting and ending degrees than we've plotted here
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(-90 * (Math.PI/180)) //converting from degs to radians
        .endAngle(180 * (Math.PI/180)) //just radians

    ctrdGrp.append("path")
        .attr("class", "outer-radius axis")
        .attr("d", arc)
     */


//var angAxisGroups = ctrdGrp.append("g") // angAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to one of 12 values: angles between 0 and 360
//    .attr("class", "angle axis")
//  .selectAll("g")
//    .data(d3.range(0, 360, 30)) // bind 12 data objects (0-360 in steps of x)
//  .enter().append("g")
//    .attr("transform", function (d) { return "rotate(" + d + ")"; }); // rotate each subgroup about the origin by the proper angle

angAxisGroups.append("line") // append a line to each 
    .attr("x1", ctrOffset) // we only need to define x1 and x2, allowing y0 and y1 to default to 0
    .attr("x2", radius);

angAxisGroups.append("text") // append some text to each
    .attr("x", radius + textPadding * 2)
    .attr("dy", textPadding / 2) // nudge text down a bit
    .style("text-anchor", function (d) { return d > 180 ? "end" : null; })
    .attr("transform", function (d) { return d > 180 ? "rotate(180 " + (radius + textPadding * 2) + ",0)" : null; })
    .text(function (d) { return d > 90 && d < 180 ? null : d; });



///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

////Extra scale since the color scale is interpolated
//var tempScale = d3.scale.linear()
//	.domain([-15, 30])
//	.range([0, width]);

////Calculate the variables for the temp gradient
//var numStops = 10;
//tempRange = tempScale.domain();
//tempRange[2] = tempRange[1] - tempRange[0];
//tempPoint = [];
//for(var i = 0; i < numStops; i++) {
//	tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
//}//for i

////Create the gradient
//svg.append("defs")
//	.append("linearGradient")
//	.attr("id", "legend-weather")
//	.attr("x1", "0%").attr("y1", "0%")
//	.attr("x2", "100%").attr("y2", "0%")
//	.selectAll("stop") 
//	.data(d3.range(numStops))                
//	.enter().append("stop") 
//	.attr("offset", function(d,i) { return tempScale( tempPoint[i] )/width; })   
//	.attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });

// Draw the legend //

//var legendWidth = Math.min(outerRadius*2, 400);

////Color Legend container
//var legendsvg = svg.append("g")
//	.attr("class", "legendWrapper")
//	.attr("transform", "translate(" + 0 + "," + (outerRadius + 70) + ")");

////Draw the Rectangle
//legendsvg.append("rect")
//	.attr("class", "legendRect")
//	.attr("x", -legendWidth/2)
//	.attr("y", 0)
//	.attr("rx", 8/2)
//	.attr("width", legendWidth)
//	.attr("height", 8)
//	.style("fill", "url(#legend-weather)");
	
////Append title
//legendsvg.append("text")
//	.attr("class", "legendTitle")
//	.attr("x", 0)
//	.attr("y", -10)
//	.style("text-anchor", "middle")
//	.text("Average Daily Temperature");

////Set scale for x-axis
//var xScale = d3.scale.linear()
//	 .range([-legendWidth/2, legendWidth/2])
//	 .domain([-15,30] );

////Define x-axis
//var xAxis = d3.svg.axis()
//	  .orient("bottom")
//	  .ticks(5)
//	  .tickFormat(function(d) { return d + "�C"; })
//	  .scale(xScale);

////Set up X axis
//legendsvg.append("g")
//	.attr("class", "axis")
//	.attr("transform", "translate(0," + (10) + ")")
//	.call(xAxis);
}

