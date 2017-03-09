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

    //diurnal stuff
    var diurnalForYear = dY.hourOfDaySummary(dObj.schema, dObj.ticks);

    var diurnalNest = d3.nest()
        .key(function(d) { return d.monthOfYear(); })
        .rollup(function(d) { return dY.hourOfDaySummary(dObj.schema, d ); })
        .entries(dObj.ticks);


///////////////
// HEAT MAP //
//////////////

// add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
board4 = dY.graph.addBoard("#dy-canvas",{inWidth: 2130, inHeight:175, margin:30});



// Setup X
//
var hxValue = function(d) { return d.dayOfYear(); }; // data -> value
var hxScale = d3.scale.linear() // value -> display
    .domain([0, 364])
    .range(board4.dDims.xRange);
var hxMap = function(d) { return hxScale(hxValue(d));}; // data -> display
var dayScale = d3.time.scale()
    .domain([new Date(dY.dt.year, 0, 1), new Date(dY.dt.year, 11, 31)])
    .range(board4.dDims.xRange);
var hxAxis = d3.svg.axis()
    .scale(dayScale)
    .orient('bottom')
    .ticks(d3.time.months) //should display 1 month intervals
    .tickSize(16, 0)
    .tickFormat(d3.time.format("%B"))
    .innerTickSize(-board4.dDims.height)
    .outerTickSize(0)
    .tickPadding(2);

// Setup Y
//
var hyValue = function(d) { return d.hourOfDay();}; // data -> value
var hyScale = d3.scale.linear()  // value -> display
    .domain([23,0])
    .range((board4.dDims.yRange));
var hyMap = function(d) { return hyScale(hyValue(d));}; // data -> display
var hyAxis = d3.svg.axis()
    .scale(hyScale)
    .orient("left")
    .tickValues([0,6,12,18,23]); // we can explicitly set tick values this way

// dimension of a single heatmap rectangle
var pixelDim = [ board4.dDims.width / 365,  board4.dDims.height / 24 ];


// function to check the comfort for dry bulb  temperature
var dryComfort = function(d) {
    if (d < 20){return d - 20;}
    if (d > 24) {return d - 24;}
    else return 0;};


// Setup Color

zonekey = "DryBulbTemp";
//zonekey = ["ZONE1","Zone People Number Of Occupants [](Hourly)"];
//zonekey = ["ZONE1","Zone Mean Air Temperature [C](Hourly)"];
var cValue = function(d) { return dryComfort(d.valueOf(zonekey));};
var cScale = d3.scale.linear()
    .domain([-50,50])
    .interpolate(d3.interpolate)
    .range([d3.rgb("#4682B4"),d3.rgb('#FF6347')]);
var cMap = function(d) { return cScale(cValue(d));}; // data -> display


// draw x-axis
board4.g.append("g")
    .attr({
        class: "x axis",
        transform: "translate(0," + (board4.dDims.height +10) + ")" // move the whole axis down a bit
    })
    .call(hxAxis)
    .select(".domain").remove()
    .selectAll(".tick text") // select all the text tags of style tick in the drawn axis
    .style("text-anchor", "start") // it seems D3 likes to set this style inline, so it can't be overridden by the CSS. We need to set here.

// draw y-axis
board4.g.append("g")
    .attr({
        class: "y axis",
        transform: "translate(-10,0)" // move the whole axis to the left a bit
    })
    .call(hyAxis)

// draw pixels
board4.g.selectAll("rect")
    .data(dObj.ticks)
    .enter().append("rect")
        .attr({
            class: "pxl",
            width: pixelDim[0],
            height: pixelDim[1],
            x: function(d) { return hxMap(d);},
            y: function(d) { return hyMap(d);},
            transform: "translate("+pixelDim[0]*-0.5+","+pixelDim[1]*-0.5+")",
            fill: function(d) { if (dryComfort(d.valueOf(zonekey)) !== 0) {return cMap(d);}
                else return "#E1F5FE";}
        })
        .style("opacity", "0.75");

    for (var m in diurnalNest){
        var mth = dY.dt.monthTable[m];
        var sticks = diurnalNest[m].values;
        console.log(mth);
        console.log(sticks);




// COMFORT CHECKING FORMULAS

    // function to check the comfort for dry bulb  temperature
    var dryComfort = function(d) {
        if (d < 20){return d - 20;}
        if (d > 24) {return d - 24;}
        else return 0;};

    // function to check the comfort for dew bulb
    var dewComfort = function(d) {
        if (d < 13){return d-13;} //want a negative number to return when it falls under the range
        if (d > 16) {return d - 16;}
        else return 0;};



    // all possible zonekeys: "EtRadHorz", "EtRadNorm","GblHorzIrad","DirNormIrad","DifHorzIrad","GblHorzIllum", "DirNormIllum","DifHorzIllum", "ZenLum", "TotSkyCvr", "OpqSkyCvr","DryBulbTemp","DewPtTemp","RelHumid","Pressure", "WindDir", "WindSpd", "HorzVis","CeilHght","PreciptWater","AeroDepth","SnowDepth", "DaysSinceSnow"

////////////////////////////////////////////////
// ALL THE LITTLE WEIRD BAR GRAPHS START HERE //
////////////////////////////////////////////////

    // board = dY.graph.addBoard("#dy-canvas",{inWidth: 100, inHeight:100, margin:30});
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 150, inHeight:150, margin:30});
    //var hmGrp = board.g.append("g").attr("transform",translate(-10,0));


//FOR GRADIENT (bg path)

    //Append a defs (for definition) element to your SVG
    var defs =  board.g.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "white"); //light

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#BBDEFB"); //almost like the  bg color


//FOR GRADIENT (bars)

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient2 = defs.append("linearGradient").attr("id", "linear-gradient2");

    //Horizontal gradient (blue)
    linearGradient2
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient2.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "steelblue"); //dark blue

    //Set the color for the end (100%)
    linearGradient2.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#E3F2FD"); //white


    //Horizontal gradient (red)

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient3 = defs.append("linearGradient").attr("id", "linear-gradient3");

    linearGradient3
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient3.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#E3F2FD"); //white

    //Set the color for the end (100%)
    linearGradient3.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "tomato"); //red



    //because of my inefficient coding i need an extra map for the bg paths
    var xMapAv= function(d) { return yScale(dryComfort(d.averageOf("DryBulbTemp"))); }; // data -> display
    var xMapAv2= function(d) { return yScale2(dryComfort(d.averageOf("DryBulbTemp"))); };


    var xMapAvmax= function(d) { return yScale(dryComfort(d.maxOf("DryBulbTemp"))); }; // data -> display
    var xMapAvmax2= function(d) { return yScale2(dryComfort(d.maxOf("DryBulbTemp"))); };


    var xMapAvmin= function(d) { return yScale(dryComfort(d.minOf("DryBulbTemp"))); }; // data -> display
    var xMapAvmin2= function(d) { return yScale2(dryComfort(d.minOf("DryBulbTemp"))); }; // data -> display

    // additional xMap for dew point temperature
    var xMapAv2= function(d) { return yScale(dewComfort(d.averageOf("DewPtTemp"))); }; // data -> display



    // setup x (hours)
    var xValue = function(d) { return d.hourOfDay();}; // data -> value

    var xScale = d3.scale.linear()  // value -> display
            .domain([0,23])
            .range(board.dDims.xRange);

    // to map on 1 to 24 on axis
    var xScale2 = d3.scale.linear()  // value -> display
            .domain([1,24])
            .range(board.dDims.xRange);

    var xMap = function(d) { return xScale(xValue(d));}; // data -> display

    var xAxis = d3.svg.axis()
            .tickValues([1,8,12,20,24])
            // .ticks(24)
            .scale(xScale2)
            .orient("left")
            .innerTickSize(-board.dDims.width-10)
            .outerTickSize(0)
            .tickPadding(2);

    // setup y
    // We define yValue as a function that, given a data item, returns the proper value for this axis
    var yScale = d3.scale.linear() // value -> display
            .domain([0,30])
            .range((board.dDims.yRange));


    // So scale will visually show -20 to 20
    var yScale2 = d3.scale.linear()
            .domain([-30,30])
            .range((board.dDims.xRange));

    var yAxis = d3.svg.axis()
            .ticks(5)
            .scale(yScale2)
            .orient("bottom")
            .outerTickSize(-board.dDims.height);

    // x-axis
    board.g.append("g")
            .attr({
                class: "x axis",
                transform: "translate(-10,0)",})
                .call(xAxis)
                .select(".domain").remove();

    // y-axis
    board.g.append("g")
              .attr({
                class: "y axis",
                transform: "translate(0," + (board.dDims.height +0) + ")"})

                .call(yAxis);

                //change long ticks
                board.g.selectAll(".tick:not(:first-of-type) line")
                    .attr("opacity", "0.25")
                    .attr("stroke", "0.5");
                    // .attr("stroke-dasharray", "9,2")


    // draw the bars for dry bulb
    board.g.selectAll("rect.drybar")
        .data(sticks)
        .enter()
        .append("rect")
        .attr({class: "drybar",
                x: function(d) {if(dryComfort(d.averageOf("DryBulbTemp")) < 0)
                    return (board.dDims.width / 2) - Math.abs((xMapAv(d)/2));
                else
                    return (board.dDims.width / 2);},
                y: function(d, i) { return i * (board.dDims.height / sticks.length); },
                height: 0.75*(board.dDims.width / sticks.length - barPadding),
                width: function(d) { return Math.abs(xMapAv(d)/2);}})
        .style({
              "fill": function(d) {
                      if(dryComfort(d.averageOf("DryBulbTemp"))<0) {return "url(#linear-gradient2)";}
                      else {return "url(#linear-gradient3)";}},
              "opacity": "0.50",
              "visibility": "visible",
            })





        // //Hovering Effects
        // .on("mouseover", function(d,i) {d3.select(this).transition().style("fill", "gray");})
        // // To return back to the original colors
        // .on("mouseout", function(d,i) {d3.select(this).transition().style("fill",
        //     function(d) {
        //         if(dryComfort(d.averageOf("DryBulbTemp"))<0) {return "steelblue";}
        //         else {return "tomato";}
        //     }
        // );})



        // // will make element disappear visually
        // .on("click", function(d) {d3.select(this).transition().style("display","none");})

        // clicking will switch to dew bar
        .on("click", function(d) {
            d3.selectAll(".drybar, .path1, .textdry").transition().style("visibility","hidden");
            d3.selectAll(".dewbar, .path2, .textdew").transition().style("visibility","visible");
        })





        //add clicks. change using visibility


        //text when you hover
        .append("title")
        //need to find out how to get hour
        .text(function(d) {
                     return "[hour]" + "\nMonth: " + months[m] + "\nAverage Dry Bulb: " + d.averageOf("DryBulbTemp").toFixed(2) + " \xB0C" + "\nDegrees from Comfort Zone: " + (dryComfort(d.averageOf("DryBulbTemp"))).toFixed(2)+ " \xB0C" + "\nComfort Zone is between 20-24 \xB0C." + "\n"+dryComfort(d.maxOf("DryBulbTemp"));
                 })

        ;


////////////////
// Whiskers //
//////////////

                // whisker max
                board.g.selectAll("rect.whisker")
                    .data(sticks)
                    .enter()
                    .append("rect")
                    .attr({class: "whisker",
                            x: function(d) {if(dryComfort(d.maxOf("DryBulbTemp")) < 0)
                                return (board.dDims.width / 2) - Math.abs((xMapAvmax(d)/2));
                            else
                                return (board.dDims.width / 2) + (xMapAvmax(d)/2);},
                            y: function(d, i) { return i * (board.dDims.height / sticks.length);},
                            height: 0.75*(board.dDims.width / sticks.length - barPadding),
                            width: ".01px"
                        })
                    .style({"opacity":"0.75",
                          "fill": "none",
                          "stroke": "#E3F2FD",
                          "stroke-width": ".25px",
                          "visibility": "visible",
                      });

                      // whisker min
                      board.g.selectAll("rect.whisker2")
                          .data(sticks)
                          .enter()
                          .append("rect")
                          .attr({class: "whisker2",
                                  x: function(d) {if(dryComfort(d.minOf("DryBulbTemp")) < 0)
                                      return (board.dDims.width / 2) - Math.abs((xMapAvmin(d)/2));
                                  else
                                      return (board.dDims.width / 2) + (xMapAvmin(d)/2);},
                                  y: function(d, i) { return i * (board.dDims.height / sticks.length); },
                                  height: 0.75*(board.dDims.width / sticks.length - barPadding),
                                  width: ".25px"})
                          .style({"opacity":"0.75",
                                "fill": "none",
                                "stroke": "#E3F2FD",
                                "stroke-width": ".25px",
                                "visibility": "visible",
                            });



/////////////////
// DEW POINT //
////////////////


        // draw the bars for dew point
        board.g.selectAll("rect.dewbar")
            .data(sticks)
            .enter()
            .append("rect")
            .attr({
                class: "dewbar",
                x: function(d) {
                    if(dewComfort(d.averageOf("DewPtTemp")) < 0){
                        return (board.dDims.width / 2) - Math.abs((xMapAv2(d)/2));}
                    else {return (board.dDims.width / 2);}
                        },
                y: function(d, i) { return i * (board.dDims.height / sticks.length); },
                height: 0.75*(board.dDims.width / sticks.length - barPadding),
                width: function(d) { return Math.abs(xMapAv2(d)/2);}
                })
            .style({
                  "opacity": function(d) {
                      if(dewComfort(d.averageOf("DewPtTemp"))<0) {return 0.25;}
                      else return 0.75; },
                  "fill": function(d) {
                      if(dewComfort(d.averageOf("DewPtTemp"))<0) {return "green";}
                      else {return "darkolivegreen";}
                  },
                 "visibility": "hidden",
                })

            // clicking will switch to dry bar
                .on("click", function(d) {
                    d3.selectAll(".drybar, .path1, .textdry").transition().style("visibility","visible");
                    d3.selectAll(".dewbar, .path2, .textdew").transition().style("visibility","hidden");

                })
                //Hovering Effects
                .on("mouseover", function(d,i) {d3.select(this).transition().style("fill", "gray");})
                // To return back to the original colors
                .on("mouseout", function(d,i) {d3.select(this).transition().style("fill",
                    function(d) {
                        if(dewComfort(d.averageOf("DewPtTemp"))<0) {return "green";}
                        else {return "darkolivegreen";}
                    }
                );})

                //text when you hover
                .append("title")
                //need to find out how to get hour
                .text(function(d) {
                                 return "[hour]" + "\nMonth: " + months[m] + "\nAverage Dew Point Temperature: " + d.averageOf("DewPtTemp").toFixed(2) + " \xB0C" + "\nDegrees from Comfort Zone: " + (dewComfort(d.averageOf("DewPtTemp"))).toFixed(2)+ " \xB0C" + "\nComfort Zone is between 13-16 \xB0C.";
                             });

///////////////////
// MONTH LABELS //
//////////////////

        board.g.append("text")
            .attr("class", "months")
            .attr("x", board.dDims.width/2)
            .attr("y", "-10")
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-family", "Tahoma, Geneva, sans-serif")
            .style("text-shadow", "3px 2px #e6e6e6")
            .text(months[m])
            // hiding notes: display none & hiding the board
            // // .on("mouseover", function(d) {d3.selectAll("#hideboard").style("display","none");})
            // .on("mouseover", function(d) {d3.selectAll("#hideboard").style("visibility","hidden");})
            // .on("mouseout", function(d) {d3.selectAll("#hideboard").style("visibility","visible");})
            ;


//////////////////////////////////////
// BG AREA SHADING FOR HI/LOW//
///////////////////////////////

        // for bg area bar
        var areaFunctionHiLo = d3.svg.area()
            .y(xMap)
            .x0(xMapAvmax2)
            .x1(xMapAvmin2)
            .interpolate("linear");

            board.g.append("path")
                .attr("d", areaFunctionHiLo(sticks))
                .attr("fill", "#BBDEFB")
                .attr("opacity", "0.15");



        }

}
