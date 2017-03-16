// model info to add later
// California Energy Code Comfort Model, 2013
//
// For the purpose of sizing residential heating and cooling systems the indoor Dry Bulb Design Conditions should be between 68°F (20°C) to 75°F (23.9°C).  No Humidity limits are specified in the Code, so 80% Relative Humidity and 66°F (18.9°C) Wet Bulb is used for the upper limit and 27°F (-2.8°C) Dew Point is used for the lower limit (but these can be changed on the Criteria screen).

//notes: things to fix: gradients, heat map, layout stuff


function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);

    // space between the bars
    var barPadding = 0.25;

    // list of months for labeling purposes
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // function to check the comfort for dry bulb  temperature
    var dryComfort = function(d) {
        if (d < 20){return d - 20;}
        if (d > 24) {return d - 24;}
        else return 0;};


    //diurnal stuff
    var diurnalForYear = dY.hourOfDaySummary(dObj.schema, dObj.ticks);

    var diurnalNest = d3.nest()
        .key(function(d) { return d.monthOfYear(); })
        .rollup(function(d) { return dY.hourOfDaySummary(dObj.schema, d ); })
        .entries(dObj.ticks);



// add a board (an SVG) to the canvas.
board = dY.graph.addBoard("#dy-canvas",{inWidth: 3020, inHeight:450, margin:10});


/////////////
// HEATMAP///
/////////////

    var heatmapWidth = 3000;
    var heatmapHeight = 150;


// SET UP X (temperature)
    var hxValue = function(d) { return d.dayOfYear(); };
    var hxScale = d3.scale.linear() // value -> display
        .domain([0, 364])
        .range([0,heatmapWidth]);
    var hxMap = function(d) { return hxScale(hxValue(d));};
    var dayScale = d3.time.scale()
        .domain([new Date(dY.dt.year, 0, 1), new Date(dY.dt.year, 11, 31)])
        .range([0, heatmapWidth]);
    var hxAxis = d3.svg.axis()
        .scale(dayScale)
        .orient('bottom')
        .ticks(d3.time.months) //should display 1 month intervals
        .tickSize(16, 4)
        .tickFormat(d3.time.format("%B"));



// SET UP Y (hours)
    var hyValue = function(d) { return d.hourOfDay();};
    var hyScale = d3.scale.linear()  // value -> display
        .domain([23,0])
        .range([heatmapHeight,0]);
    var hyMap = function(d) { return hyScale(hyValue(d));};
    var hyAxis = d3.svg.axis()
        .scale(hyScale)
        .orient("left")
        .tickValues([0,6,12,18,23]); // we can explicitly set tick values this way
    var pixelDim = [ heatmapWidth/365,  heatmapHeight/24 ];



// Setup Color
    zonekey = "DryBulbTemp";
    var cValue = function(d) { return dryComfort(d.valueOf(zonekey));};


    var coloursYGB = ["#29B6F6","#4FC3F7", "#81D4FA", "#B3E5FC","#E1F5FE","#FFCCBC", "#FFAB91", "#FF8A65", "#FF7043"];
    var colourRangeYGB = d3.range(0, 1, 1.0 / (coloursYGB.length - 1));
    colourRangeYGB.push(1);

    //Create color gradient
    var colorScaleYGB = d3.scale.linear()
	   .domain(colourRangeYGB)
	   .range(coloursYGB)
	   .interpolate(d3.interpolateHcl);

//Needed to map the values of the dataset to the color scale
var colorInterpolateYGB = d3.scale.linear()
	.domain([-30,30])
	.range([0,1]);



    // draw x-axis
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(15," + (heatmapHeight +5) + ")" // move the whole axis down a bit
        })
        .call(hxAxis)
        // .select(".domain").remove()
        .selectAll(".tick text") // select all the text tags of style tick in the drawn axis
        .style("text-anchor", "start")
         // it seems D3 likes to set this style inline, so it can't be overridden by the CSS. We need to set here.
         .attr("transform","translate(0,-15)");

    // draw y-axis
    board.g.append("g")
        .attr({
            class: "y axis",
            transform: "translate(15,0)" // move the whole axis to the left a bit
        })
        .call(hyAxis);

    // draw pixels
    var heatmap = board.g.selectAll("rect")
        .data(dObj.ticks)
        .enter().append("rect")
        .attr({
                class: "pxl",
                width: pixelDim[0],
                height: pixelDim[1],
                x: function(d) { return 20 + hxMap(d);},
                y: function(d) { return hyMap(d);},
                transform: "translate("+pixelDim[0]*-0.5+","+pixelDim[1]*-0.5+")",
                fill: function(d) {return colorScaleYGB(colorInterpolateYGB(cValue(d)));},
                stroke: "white",
                "stroke-width": "0.25"


            })
            .on("mouseover", function(d,i) {d3.select(this).attr("fill", "lavender");})
            .on("mouseout", function(d,i) {d3.select(this).transition().style("fill", function(d) {return colorScaleYGB(colorInterpolateYGB(cValue(d)));});})
            .append("title")
            .text(function(d) {
                return "Month: "+ (months[d.monthOfYear("DryBulbTemp")]) + "\nDay of Year: " + (d.dayOfYear("DryBulbTemp")+1) +
                "\nHour of Day: "+ (d.hourOfDay("DryBulbTemp")) + "\nDry Bulb Temp: " + d.valueOf(zonekey) + " \xB0C" + "\nAway from Comfort: " + dryComfort(d.valueOf(zonekey)).toFixed(2) + " \xB0C" + "\nComfort Zone is between 20-24 \xB0C.";
            });




    heatmap.attr("transform", "translate(15,50)");



//////////////////////
// GRADIENT LEGEND
///////////////////////

    var defs = svg.append("defs");
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    linearGradient.selectAll("stop")
        .data([
                {offset: "0%", color: "#29B6F6"}, //blue
                {offset: "12.5%", color: "#4FC3F7"},
                {offset: "25%", color: "#81D4FA"},
                {offset: "37.5%", color: "#B3E5FC"},
                {offset: "50%", color: "#E1F5FE"}, //middle
                {offset: "62.5%", color: "#FFCCBC"},
                {offset: "75%", color: "#FFAB91"},
                {offset: "87.5%", color: "#FF8A65"},
                {offset: "100%", color: "#FF7043"} //red
                      ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });


        //
        // board.g.append("rect")
        //     .attr("class", "rectsum")
        //     .attr("width", 250)
        //     .attr("height", 150)
        //     .attr("transform", "translate(3075,100)")
        //     .style("fill", "white")
        //     .style("opacity", "0.25");


    // Draw the rectangle and fill with gradient
    board.g.append("rect")
        .attr("class", "legend")
        .attr("width", 250)
        .attr("height", 10)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", "translate(15,190)");
        // .attr("transform", "rotate(90)");

    // board.g.append("text")
    //             .attr("class", "title")
    //             .attr("x", "3200")
    //             .attr("y", "135")
    //             .attr("text-anchor", "middle")
    //             .text("Legend");





// x-axis (all the x axis in the for loop are hidden)

        var xRange = 250;
        var yRange = 200;

        var xScale = d3.scale.linear()  // value -> display
                .domain([0,23])
                .range([0,yRange]);

        var xAxis = d3.svg.axis()
                // .tickValues([1,12,24])
                .tickValues([0,8,12,20,23])
                .scale(xScale)
                .orient("left")
                .innerTickSize(-yRange*15-10)
                .outerTickSize(0)
                .tickPadding(2);

        // x-axis
        board.g.append("g")
                .attr({
                    class: "x axis",
                    transform: "translate(5,250)",
                })
                    .call(xAxis)
                    .select(".domain").remove();


//////////////
//BAR GRAPH
///////////////

for (var m in diurnalNest){
    var mth = dY.dt.monthTable[m];
    var sticks = diurnalNest[m].values;
    console.log(mth);
    console.log(sticks);

    // Draw the rectangle and fill with gradient
    board.g.append("rect")
        .attr("class", "legend")
        .attr("width", 250)
        .attr("height", 10)
        .style("fill", "url(#linear-gradient)")
        .attr("transform", "translate(" +(15 +(heatmapWidth/12) * m)+ ",190)");
        // .attr("transform", "rotate(90)");


    // board.g.append("text")
    //         .attr("class", "title")
    //         .attr("x", "" + (130+(heatmapWidth/12) * m) + "px")
    //         .attr("y", "-25px")
    //         .attr("text-anchor", "middle")
    //         .text("" + months[m] + "");

    // board2 = dY.graph.addBoard("#dy-canvas",{inWidth: 150, inHeight:150, margin:30});

    var xRange = 250;
    var yRange = 200;


    var board2 = board.g.append("g").attr("transform","translate(" + (15+(((heatmapWidth)/12) * m))  + "," + (heatmapHeight+100) + ")");

//60

    //2 mapping scales; ending with 2 are for the dots and area

    var xMapAv= function(d) { return yScale(dryComfort(d.averageOf("DryBulbTemp"))); }; // data -> display\
    var xMapAv2= function(d) { return yScale2(dryComfort(d.averageOf("DryBulbTemp"))); }; // data -> display

    var xMapAvmax= function(d) { return yScale(dryComfort(d.maxOf("DryBulbTemp"))); }; // data -> display
    var xMapAvmax2= function(d) { return yScale2(dryComfort(d.maxOf("DryBulbTemp"))); };


    var xMapAvmin= function(d) { return yScale(dryComfort(d.minOf("DryBulbTemp"))); }; // data -> display
    var xMapAvmin2= function(d) { return yScale2(dryComfort(d.minOf("DryBulbTemp"))); }; // data -> display






    // setup x (hours)
    var xValue = function(d) { return d.hourOfDay();}; // data -> value

    var xScale = d3.scale.linear()  // value -> display
            .domain([0,23])
            .range([0,yRange]);

    // to map on 1 to 24 on axis
    var xScale2 = d3.scale.linear()  // value -> display
            .domain([1,24])
            .range([0,yRange]);

    var xMap = function(d) { return xScale(xValue(d));}; // data -> display

    var xAxis = d3.svg.axis()
            // .tickValues([1,12,24])
            .tickValues([0,8,12,20,23])
            .scale(xScale)
            .orient("left")
            .innerTickSize(-xRange-10)
            .outerTickSize(0)
            .tickPadding(2);

    // setup y
    // We define yValue as a function that, given a data item, returns the proper value for this axis



    var yScale = d3.scale.linear() // value -> display
            .domain([0,30])
            .range([0,yRange]);

    // So scale will visually show -30 to 30
    var yScale2 = d3.scale.linear()
            .domain([-30,30])
            .range([0,xRange]);

    var yAxis = d3.svg.axis()
            // .ticks(5)
            .tickValues([-30,-15,0,15,])
            .scale(yScale2)
            .orient("bottom")
            .innerTickSize(-yRange)
            .outerTickSize(-yRange);

    // // x-axis
    // board2.append("g")
    //         .attr({
    //             class: "x axis",
    //             transform: "translate(-10,0)",
    //         })
    //             .call(xAxis)
    //             .select(".domain").remove();



    // y-axis
    board2.append("g")
              .attr({
                class: "y axis",
                transform: "translate(0," + (yRange) + ")"})
                .call(yAxis);

                //change long ticks
                board2.selectAll(".tick:not(:first-of-type) line")
                    .attr("opacity", "0.25")
                    .attr("stroke", "0.5")
                    // .attr("stroke-dasharray", "9,2")


// for bg area bar
    var areaFunctionHiLo = d3.svg.area()
                            .y(xMap)
                            .x0(xMapAvmax2)
                            .x1(xMapAvmin2)
                            .interpolate("linear");
    board2.append("path")
                            .attr("d", areaFunctionHiLo(sticks))
                            .attr("fill", "#F5F5F5");



    // draw the bars for dry bulb
    board2.selectAll("rect.drybar")
        .data(sticks)
        .enter()
        .append("rect")
        .attr({class: "drybar",
                x: function(d) {if(dryComfort(d.averageOf("DryBulbTemp")) < 0)
                    return (xRange / 2) - Math.abs((xMapAv(d)/2));
                else
                    return (xRange / 2);},
                y: function(d, i) { return i * (yRange / sticks.length); },
                height: 0.75*(xRange / sticks.length - barPadding),
                width: function(d) { return Math.abs(xMapAv(d)/2);}})
        .style({"fill": function(d) {return colorScaleYGB(colorInterpolateYGB(dryComfort(d.averageOf("DryBulbTemp"))));},
            })
        .append("title")
        .text(function(d) {
                     return "Hour of Day: "+ (d.hourOfDay("DryBulbTemp"))  + "\nMonth: " + months[m] + "\nAverage Dry Bulb: " + d.averageOf("DryBulbTemp").toFixed(2) + " \xB0C" + "\nDegrees from Comfort Zone: " + (dryComfort(d.averageOf("DryBulbTemp"))).toFixed(2)+ " \xB0C" + "\nMax,Min from Comfort Zone: " +
                     (dryComfort(d.maxOf("DryBulbTemp"))).toFixed(2)+ "," +(dryComfort(d.minOf("DryBulbTemp"))).toFixed(2)+ "\nComfort Zone is between 20-24 \xB0C.";
                 });

 //////////////////////////////////////
 // BG AREA OUTLINE FOR HI/LOW//
 ///////////////////////////////

 board2.append("path")
    .attr("d", areaFunctionHiLo(sticks))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", "0.2");

////////////////////////////
// Min Max Dots + bg line//
/////////////////////////////


board2.selectAll("rect.line")
.data(sticks)
.enter().append("line")      // attach a line
    .style("stroke", "black")  // colour the line
    .attr("x1", function(d) {return xMapAvmin2(d);})     // x position of the first end of the line
    .attr("y1", function(d, i) { return i * (yRange / sticks.length)+3.5; })      // y position of the first end of the line
    .attr("x2", function(d) {return xMapAvmax2(d);})     // x position of the second end of the line
    .attr("y2", function(d, i) { return i * (yRange / sticks.length)+3.5; })
    .style("stroke-width", "0.25")
    .style("opacity", "0.50")
    .style("stroke-dasharray", ("3, 1"));



board2.selectAll("circle.highcirc")
    .data(sticks)
    .enter().append("circle")
    .attr("class",'circle')
    .attr("fill", "gray")
    .attr("r", 1)
    .attr("cx", function(d) {return xMapAvmax2(d);})
    .attr("cy", function(d, i) { return i * (yRange / sticks.length)+3.5; }); //3.5 to shift a little down


board2.selectAll("circle.lowcirc")
    .data(sticks)
    .enter().append("circle")
    .attr("class",'circle')
    .attr("fill", "gray")
    .attr("r", 1)
    .attr("cx", function(d) {return xMapAvmin2(d);})
    .attr("cy", function(d, i) { return i * (yRange / sticks.length)+3.5; });

    board2.selectAll("circle.midcirc")
        .data(sticks)
        .enter().append("circle")
        .attr("class",'circle')
        .attr("fill", "steelblue")
        .attr("stroke","red")
        .attr("stroke-width","0.25px")
        .attr("r", 1.25)
        .attr("cx", function(d) {return xMapAv2(d);})
        .attr("cy", function(d, i) { return i * (yRange / sticks.length)+3.5; }); //3.5 to shift a little down


}

//////////////////////
//HISTOGRAM//////////
/////////////////////

//sorry couldnt apply the comfort function to make it work :(


    var board3 = board.g.append("g").attr("transform","translate(" + (75+ heatmapWidth )  + "," + 0 + ")");

    var xRange = 350;
    var yRange = 400;

    var vals = dObj.valuesOf("DryBulbTemp");

    var bins = d3.layout.histogram()
        .bins(5)       // to use 20 bins
        .range(d3.extent(vals))
        (vals);

    console.log(bins)






}
