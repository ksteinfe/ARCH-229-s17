
      
    var screenWidth = window.innerWidth;

    var margin = { left: 20, top: 20, right: 20, bottom: 20 },
        width = Math.min(screenWidth, 500) - margin.left - margin.right,
        height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

    var originX = 0
    var originY = 0;


    var svg = d3.select("#chart").append("svg")
                .attr("width", (width + margin.left + margin.right))
                .attr("height", (height + margin.top + margin.bottom))
               .append("g").attr("class", "wrapper")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    ////////////////////////////////////////////////////////////// 
    ///////////////////// Data &  Scales ///////////////////////// 
    ////////////////////////////////////////////////////////////// 

    
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
       .domain([1, 3.5, 6])
       .range(["#d2d2d2", "#d3d3d3", "#ffffff"])
       .interpolate(d3.interpolateHcl);

 

    //arc function   
    var arc = d3.svg.arc()
        .innerRadius(width * 0.7 / 2)
        .outerRadius(width * 0.7 / 2 + 5);

    var table = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        r: width * 0.8 / 2,
        fill: "none",
        stroke: "black"
    });

    var group = svg.append("g");
    var rZeroCircle = width * 0.4 / 2;
    var rOuterCircle = width * 0.8 / 2+5;

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
    var barWidth = 2*(width * 0.8 / 2+5)*Math.PI/365;
    for (var i = 0; i < 365; i++) {
        var barOriginX = originX + ((rZeroCircle) * Math.sin(i));
        var barOriginY = originY - ((rZeroCircle) * Math.cos(i));
        var barOuterOriginX = originX + ((rOuterCircle) * Math.sin(i));
        var barOuterOriginy = originY - ((rOuterCircle) * Math.cos(i));

        //draw circle instead of bar, this is the zero degree one.
        var bar = svg.append("circle").attr({
            cx: barOriginX,
            cy: barOriginY,
            r: (Math.PI) * (rZeroCircle) / 365,
            opacity: 1,
            fill: "#00c2f3",
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
    

    //Turn the pie chart 90 degrees counter clockwise, so it starts at the left	
    var pie = d3.layout.pie()
        .startAngle(0 * Math.PI / 180)
        .endAngle(0 * Math.PI / 180 + 2 * Math.PI)
        .value(function (d) { return d.value; })
        .padAngle(.01)
        .sort(null);

    ////////////////////////////////////////////////////////////// 
    //////////////////// Create Donut Chart ////////////////////// 
    ////////////////////////////////////////////////////////////// 

    svg.selectAll(".donutArcSlices")
			.data(pie(monthsData))
		  .enter().append("path")
			.attr("class", "donutArcSlices")
			.attr("d", arc)
			.style("fill", function (d, i) {
			    if (i === 7) return "#CCCCCC"; //Other
			    else return colorScale(i);
			})
			.each(function (d, i) {

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

    //Append the label names on the outside
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

//////////////////////////////////////////////////////
//////////////////TEMPERATURE////////////////////////////////////
//////////////////////////////////////////////////////


//Parses a string into a date
var parseDate = d3.time.format("%Y-%m-%d").parse;

//Turn strings into actual numbers/dates
weatherBoston.forEach(function(d) {
	d.date = parseDate(d.date);
});

//Set the minimum inner radius and max outer radius of the chart
var outerRadius = rZeroCircle*1.6,
	innerRadius = outerRadius * 0.4;

//Base the color scale on average temperature extremes
var colorScale = d3.scale.linear()
	.domain([-15, 7.5, 30])
	.range(["#2c7bb6", "#ffff8c", "#d7191c"])
	.interpolate(d3.interpolateHcl);

//Scale for the heights of the bar, not starting at zero to give the bars an initial offset outward
var barScale = d3.scale.linear()
	.range([innerRadius, outerRadius])
	.domain([-15,30]); 

//Scale to turn the date into an angle of 360 degrees in total
//With the first datapoint (Jan 1st) on top
var angle = d3.scale.linear()
	.range([-180, 180])
	.domain(d3.extent(weatherBoston, function(d) { return d.date; }));	 


///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create Axes /////////////////////////////////
///////////////////////////////////////////////////////////////////////////

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



///////////////////////////////////////////////////////////////////////////
////////////////////////////// Draw bars //////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Draw a bar per day were the height is the difference between the minimum and maximum temperature
//And the color is based on the mean temperature
barWrapper.selectAll(".tempBar")
 	.data(weatherBoston)
 	.enter().append("rect")
 	.attr("class", "tempBar")
 	.attr("transform", function(d,i) { return "rotate(" + (angle(d.date)) + ")"; })
 	.attr("width", 1.5)
	.attr("height", function(d,i) { return barScale(d.max_temp) - barScale(d.min_temp); })
 	.attr("x", -0.75)
 	.attr("y", function(d,i) {return barScale(d.min_temp); })
 	.style("fill", function(d) { return colorScale(d.mean_temp); });
	
///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Extra scale since the color scale is interpolated
var tempScale = d3.scale.linear()
	.domain([-15, 30])
	.range([0, width]);

//Calculate the variables for the temp gradient
var numStops = 10;
tempRange = tempScale.domain();
tempRange[2] = tempRange[1] - tempRange[0];
tempPoint = [];
for(var i = 0; i < numStops; i++) {
	tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
}//for i

//Create the gradient
svg.append("defs")
	.append("linearGradient")
	.attr("id", "legend-weather")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop") 
	.data(d3.range(numStops))                
	.enter().append("stop") 
	.attr("offset", function(d,i) { return tempScale( tempPoint[i] )/width; })   
	.attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });

///////////////////////////////////////////////////////////////////////////
////////////////////////// Draw the legend ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

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


