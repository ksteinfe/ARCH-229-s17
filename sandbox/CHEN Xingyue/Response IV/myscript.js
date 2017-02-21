

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 200, inHeight:200, margin:40});
    //console.log(board);
      
    var screenWidth = window.innerWidth;

    var margin = { left: 20, top: 20, right: 20, bottom: 20 },
        width = Math.min(screenWidth, 500) - margin.left - margin.right,
        height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

    var svg = d3.select("#chart").append("svg")
                .attr("width", (width + margin.left + margin.right))
                .attr("height", (height + margin.top + margin.bottom))
               .append("g").attr("class", "wrapper")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    ////////////////////////////////////////////////////////////// 
    ///////////////////// Data &  Scales ///////////////////////// 
    ////////////////////////////////////////////////////////////// 

    //Some random data
    var donutData = [
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

    //Create a color scale
    var colorScale = d3.scale.linear()
       .domain([1, 3.5, 6])
       .range(["#2c7bb6", "#ffffbf", "#d7191c"])
       .interpolate(d3.interpolateHcl);

    //Create an arc function   
    var arc = d3.svg.arc()
        .innerRadius(width * 0.75 / 2)
        .outerRadius(width * 0.75 / 2 + 10);

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
			.data(pie(donutData))
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
        .data(donutData)
       .enter().append("text")
        .attr("class", "donutText")
        .attr("dy", -13)
       .append("textPath")
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .attr("xlink:href", function (d, i) { return "#donutArc" + i; })
        .text(function (d) { return d.name; });

}

