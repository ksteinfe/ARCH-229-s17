


function onDataLoaded(dObj) {
    console.log(dObj)
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
    var board = dY.graph.addBoard("#dy-canvas",{inWidth: 400, inHeight:500, margin:50});
    var width = board.dDims.width;
    var height = board.dDims.height;
    
    var svg = board.g.append("g").attr("class", "wrapper")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
    
    //////ADD CITY NAME TO THE TOP/////
    var cityName = document.getElementById("csv-file").value;
    //var cityName = dObj.location.city;
    var dotPosition = cityName.indexOf(".");
   cityName = cityName.slice(0, dotPosition);
    var hyphonPosition = cityName.lastIndexOf("_");
    cityName = cityName.slice(hyphonPosition + 1, cityName.length);

    //////tooltip
    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var divTemp= d3.select("body").append("div")
   .attr("class", "tooltipTemp")
   .style("opacity", 0);

    var divWind = d3.select("body").append("div")
   .attr("class", "tooltipWind")
   .style("opacity", 0);


    ////Date format
    var lunasFormat = function (ts) {
        var dt = new Date(ts.mid * 1000 * 60);
        var mth = dY.dt.monthTable[dt.getUTCMonth()].shortname;
        var dat = dt.getUTCDate();
        var hours = dt.getUTCHours();
        var mins = dt.getUTCMinutes();

        var pad = function (n) { return (n < 10) ? ("0" + n) : n; }

        return mth + " " + pad(dat) + " " + pad(hours) + ":" + pad(mins)
    }

    var lunasFormatDate = function (ts) {
        var dt = new Date(ts.mid * 1000 * 60);
        var mth = dY.dt.monthTable[dt.getUTCMonth()].shortname;
        var dat = dt.getUTCDate();
        var hours = dt.getUTCHours();
        var mins = dt.getUTCMinutes();

        var pad = function (n) { return (n < 10) ? ("0" + n) : n; }

        return mth + " " + pad(dat) 
    }

    var niceFormat = function (ts) { return dY.dt.niceFormat(new Date(ts.mid * 1000 * 60)) }

    board.g.append("text")
            .text(cityName)
            .style("text-anchor", "middle")
            .attr({
                class: "city-label",
                x: 200,
                y: 0
            });


    





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
        .innerRadius(rZeroCircle+25)
        .outerRadius(rZeroCircle + 38);

    //var table = svg.append("circle").attr({
    //    cx: originX,
    //    cy: originY,
    //    r: width * 0.8 / 2,
    //    fill: "none",
    //    stroke: "black"
    //});

   

    var outerCircle = svg.append("circle").attr({
        cx: originX,
        cy: originY,
        opacity: 0,
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
            fill: "#5c6277",
            stroke: "none"
        });
        //var outbar = svg.append("circle").attr({
        //    cx: barOuterOriginX,
        //    cy: barOuterOriginy,
        //    r: ((Math.PI) * (rOuterCircle) / 365)*0.8,
        //    opacity: 1,
        //    fill: "#00c2f3",
        //    stroke: "none"
        //});
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
var colorScaleTemp = d3.scale.linear()
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
	.text(function(d) { return d + "°C"});



////////// Draw bars //////////////

//Draw a bar per day were the height is the difference between the minimum and maximum temperature
    //And the color is based on the mean temperature

// Var
var barColor = function (d) { return colorScaleTemp(d.averageOf("DryBulbTemp")); };


//
barWrapper.selectAll(".tempBar")
 	.data(dSum)
 	.enter().append("rect")
 	.attr("class", "tempBar")
 	.attr("transform", function (d, i) { return "rotate(" + (angle(i)) + ")"; })
 	.attr("width", 1.5)
	.attr("height", function (d, i) { return barScale(d.maxOf("DryBulbTemp")) - barScale(d.minOf("DryBulbTemp")); })
 	.attr("x", -0.75)
    .attr("stroke", "DeepPink")
    .attr('stroke-width', 0)
      .on('mouseover', function (d) {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('stroke-width', 5)

          divTemp.transition()
             .duration(200)
             .style("opacity", .9);


          divTemp.html("<strong>DRY BULB TEMPERATURE DAILY SUMMARY </strong>" + "<br/>" + lunasFormatDate(d.ts) + "<br/>"+"Max Temperature: " + d.maxOf("DryBulbTemp") + "°C" + "<br/>" + "Min Temperature: " + d.minOf("DryBulbTemp") + "°C" + "<br/>" + "Average Temperature: " + d.averageOf("DryBulbTemp").toFixed(2) + "°C" + "<br/>" + "Comfort Temperature: 18-24°C")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
      })


      .on('mouseout', function (d) {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('stroke-width', 0)

          divTemp.transition()
              .duration(500)
              .style("opacity", 0);

      })
 	.attr("y", function (d, i) { return barScale(d.minOf("DryBulbTemp")); })
 	.style("fill", barColor);
    //.append("title")
    //.text(function (d) {
    //    return "Dry Bulb Temperature Daily Summary "
    //        + "\n" + lunasFormatDate(d.ts)
    //        + "\n" + "Max Temperature: " + d.maxOf("DryBulbTemp") + "°C"
    //        + "\n" + "Min Temperature: " + d.minOf("DryBulbTemp") + "°C"
    //        + "\n" + "Average Temperature: " + d.averageOf("DryBulbTemp").toFixed(2) + "°C"
    //});
    


    






    //HUMIDITY

var outerRadiusRain = rZeroCircle * 2.5,
	innerRadiusRain = outerRadiusRain * 0.75;

    // Color according to mean temperature. 
var colorScaleHum = d3.scale.linear()
	.domain([30,60])
	.range(["#89fffb", "#007fff"])
	.interpolate(d3.interpolateHcl);

var colorScaleHumExtreme = d3.scale.linear()
.domain([30, 60, 70])
.range(["#89fffb", "#007fff", "#C71585"])
.interpolate(d3.interpolateHcl);



    //bar height
var barScale = d3.scale.pow().exponent(2)
	.range([innerRadiusRain, outerRadiusRain])
	.domain([0, 100]);

var angle = d3.scale.linear()
	.range([-180, 180])
	.domain([0, 364]);


    //  Axes

    //Wrapper for the bars and to position it downward
var barWrapper = svg.append("g")
	.attr("transform", "translate(" + 0 + "," + 0 + ")");

   



    // Draw bars 

    //Draw a bar per day were the height is the difference between the minimum and maximum temperature
    //And the color is based on the mean temperature
barWrapper.selectAll(".rainBar")
 	.data(dSum)
 	.enter().append("rect")
 	.attr("class", "rainBar")
 	.attr("transform", function (d, i) { return "rotate(" + (angle(i)) + ")"; })
 	.attr("width", 1.5)
	.attr("height", function (d, i) { return barScale(d.averageOf("RelHumid")) - barScale(0); })
 	.attr("x", -0.75)
 	.attr("y", function (d, i) { return barScale(0); })
 	.style("fill", function (d) { return colorScaleHum(d.averageOf("RelHumid")); })
    .attr("stroke", "teal")
    .attr('stroke-width', 0)
      .on('mouseover', function (d) {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('stroke-width', 5)

          div.transition()
                .duration(200)
                .style("opacity", .9);

          //drawPopHumidity(d);
          //popGroup.transition()		
          //    .duration(250)		
          //    .style("opacity", 1.0)
          div.html("<strong>RELATIVE HUMIDITY DAILY SUMMARY </strong>" + "<br/>" + lunasFormatDate(d.ts) + "<br/>"+"Max Humidity: " + d.maxOf("RelHumid") + "%" + "<br/>" + "Min Humidity: " + d.minOf("RelHumid") + "%" + "<br/>" + "Average Humidity: " + d.averageOf("RelHumid").toFixed(2) + "%" + "<br/>" + "Comfort Humidity: 25% - 60%")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
      })

      .on('mouseout', function (d) {
          d3.select(this)
            .transition()
            .duration(800)
            .attr('stroke-width', 0)

          div.transition()
               .duration(500)
               .style("opacity", 0);

          //delPop(d);
          //popGroup.transition()		
          //    .duration(250)		
          //    .style("opacity", 0.0)            
      });
    //.append("title")
    //.text(function (d) {
    //    return "Relative Humidity Daily Summary "
    //        + "\n" + lunasFormatDate(d.ts)
    //        + "\n" + "Max Humidity: " + d.maxOf("RelHumid") + "%"
    //        + "\n" + "Min Humidity: " + d.minOf("RelHumid") + "%"
    //        + "\n" + "Average Humidity: " + d.averageOf("RelHumid").toFixed(2) + "%"
    //});




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

//for chart
var radiusChart = 20;
var radScaleChart = d3.scale.linear()  // value -> display
    //.domain(dObj.metaOf("WindSpd").domain)
    .domain([0, 5])
    .range([ctrOffset, radiusChart])
var radMapChart = function (d) { return radScaleChart(radValue(d)); };


    // setup angle
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
var angValue = function (d) { return d.dayOfYear(); };
var angScale = d3.scale.linear() // value -> display
    .domain([0, 364])
    .range([0, 2 * Math.PI]);
var angMap = function (d) { return angScale(angValue(d)); }; // data -> display

    //for chart
var angValueDir = function (d) { return d.valueOf("WindDir"); };
var angScaleChart= d3.scale.linear() // value -> display
    .domain([0, 364])
    .range([0, 2 * Math.PI]);
var angMapDir = function (d) { return angScaleChart(angValueDir(d)); };


    // Define the svg for the tooltip
var popGroup = board.g.append("g")
    .style("opacity", 0.0);

popGroup.append("rect")
    .attr("class", "popup")
 	.attr("width", 100)
	.attr("height", 100)
 	.attr("x", 0)
 	.attr("y", 0);






var delPop = function (d) {
    popGroup.select("#popgraph").remove()
    
}
//var delPopText = function (d) {
//    popGroup.select("#textWind").remove()

//}

var drawPopWindRose = function (d) {
    console.log(d);
    var drawGroup = popGroup.append("g").attr("id", "popgraph");

    //board.g.append("text")
    //        .text("Windrose:Speed and Direction")
    //        .style("text-anchor", "left")
    //        .attr("id", "textWind")
    //        .attr({
    //            class: "Windrose",
    //            x: 200,
    //            y: 0
    //    });

 


    drawGroup.append("g").selectAll(".dot")
    .data(dObj.ticks)
    .enter().append("circle")
        .attr({
            class: "dot",
            r: 1.0,
            cx: function (d) { return (radMapChart(d) * Math.cos(angMapDir(d))); },
            cy: function (d) { return (radMapChart(d) * Math.sin(angMapDir(d))); }
        })
        .attr("transform", "translate(" + 50 + "," + 50 + ")");
}


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
        .attr("stroke", "orange")
        .attr('stroke-width', 0)
          .on('mouseover', function (d) {
              d3.select(this)
                .transition()
                .duration(800)
                .attr('stroke-width', 5)

              drawPopWindRose(d);
              popGroup.transition()
                  .duration(250)
                  .style("opacity", 1.0)

              divWind.transition()
             .duration(200)
             .style("opacity", .9);


              divWind.html("<strong>HOURLY WIND SPEED  </strong>" +  "<br/>"+lunasFormat(d.ts) + "<br/>" + "Windspeed: " + d.valueOf("WindSpd") + "mph" + "<br/>"+"<br/>"+"<strong>Graph:</strong>" +"<br/>"+"Windrose: Annual Speed and Direction")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
          })
          .on('mouseout', function (d) {
              d3.select(this)
                .transition()
                .duration(800)
                .attr('stroke-width', 0)

              delPop(d);

              popGroup.transition()
                  .duration(250)
                  .style("opacity", 0.0)

              divWind.transition()
             .duration(500)
             .style("opacity", 0);
          });
        //.append("title")
        //.text(function (d) {
        //    return "Wind Speed for " + lunasFormat(d.ts)
        //      //  + "\n" + "Max Windspeed: " + d.maxOf("WindSpd") + "mph"
        //        + "\n" + "Windspeed: " + d.valueOf("WindSpd") + "mph"
        //});
       
       
    ///////////////////////////////////////////////////////////////////////////
    //////////////// Create the gradient for the legend Temperature///////////////////////
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
for (var i = 0; i < numStops; i++) {
    tempPoint.push(i * tempRange[2] / (numStops - 1) + tempRange[0]);
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
    .attr("offset", function (d, i) { return tempScale(tempPoint[i]) / width; })
    .attr("stop-color", function (d, i) { return colorScaleTemp(tempPoint[i]); });

    // Draw the legend //

var legendWidth = Math.min(outerRadius * 2, 400);

    //Color Legend container
var legendsvg = svg.append("g")
    .attr("class", "legendWrapper")
    .attr("transform", "translate(" + 0 + "," + (outerRadius + 80) + ")");

    //Draw the Rectangle
legendsvg.append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2)
    .attr("y", 0)
    .attr("rx", 8 / 2)
    .attr("width", legendWidth)
    .attr("height", 2)
    .style("fill", "url(#legend-weather)");

    //Append title
legendsvg.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text("Average Daily Temperature");

    //Set scale for x-axis
var xScale = d3.scale.linear()
     .range([-legendWidth / 2, legendWidth / 2])
     .domain([-15, 30]);

    //Define x-axis
var xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(5)
      .tickFormat(function (d) { return d + "°C"; })
      .scale(xScale);

    //Set up X axis
legendsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (10) + ")")
    .call(xAxis);
    




    ///////////////////////////////////////////////////////////////////////////
    //////////////// Create the gradient for the legend Humidity///////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Extra scale since the color scale is interpolated
var tempScale = d3.scale.linear()
    .domain([0, 100])
    .range([0, width]);

    //Calculate the variables for the temp gradient
var numStops = 10;
tempRange = tempScale.domain();
tempRange[2] = tempRange[1] - tempRange[0];
tempPoint = [];
for (var i = 0; i < numStops; i++) {
    tempPoint.push(i * tempRange[2] / (numStops - 1) + tempRange[0]);
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
    .attr("offset", function (d, i) { return tempScale(tempPoint[i]) / width; })
    .attr("stop-color", function (d, i) { return colorScaleHum(tempPoint[i]); });

    // Draw the legend //

var legendWidth = Math.min(outerRadius * 2, 400);

    //Color Legend container
var legendsvg = svg.append("g")
    .attr("class", "legendWrapper")
    .attr("transform", "translate(" + 0 + "," + (outerRadius + 130) + ")");

    //Draw the Rectangle
legendsvg.append("rect")
    .attr("class", "legendRect")
    .attr("x", -legendWidth / 2)
    .attr("y", 0)
    .attr("rx", 8 / 2)
    .attr("width", legendWidth)
    .attr("height", 2)
    .style("fill", "url(#legend-weather)");

    //Append title
legendsvg.append("text")
    .attr("class", "legendTitle")
    .attr("x", 0)
    .attr("y", -10)
    .style("text-anchor", "middle")
    .text("Average Daily Humidity");

    //Set scale for x-axis
var xScale = d3.scale.linear()
     .range([-legendWidth / 2, legendWidth / 2])
     .domain([0, 100]);

    //Define x-axis
var xAxis = d3.svg.axis()
      .orient("bottom")
      .ticks(5)
      .tickFormat(function (d) { return d + "%"; })
      .scale(xScale);

    //Set up X axis
legendsvg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (10) + ")")
    .call(xAxis);



}

