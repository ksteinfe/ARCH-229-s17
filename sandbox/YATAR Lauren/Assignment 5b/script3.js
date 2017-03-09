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

    for (var m in diurnalNest){
        var mth = dY.dt.monthTable[m];
        var sticks = diurnalNest[m].values;
        console.log(mth);
        console.log(sticks);

    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).

    // function to check the comfort for dry bulb
    var dewComfort = function(d) {
        if (d < 13){return d-13;} //want a negative number to return when it falls under the range
        if (d > 16) {return d - 16;}
        else return 0;};



    // all possible zonekeys: "EtRadHorz", "EtRadNorm","GblHorzIrad","DirNormIrad","DifHorzIrad","GblHorzIllum", "DirNormIllum","DifHorzIllum", "ZenLum", "TotSkyCvr", "OpqSkyCvr","DryBulbTemp","DewPtTemp","RelHumid","Pressure", "WindDir", "WindSpd", "HorzVis","CeilHght","PreciptWater","AeroDepth","SnowDepth", "DaysSinceSnow"


    // function to check the comfort for dry bulb  temperature
    var dryComfort = function(d) {
        if (d < 20){return d - 20;}
        if (d > 24) {return d - 24;}
        else return 0;};


    // board = dY.graph.addBoard("#dy-canvas",{inWidth: 100, inHeight:100, margin:30});
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 150, inHeight:150, margin:30});


    var xMapAv= function(d) { return yScale(dryComfort(d.averageOf("DryBulbTemp"))); }; // data -> display\

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
            // .tickValues([1,12,24])
            .ticks(24)
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
            .outerTickSize(-board.dDims.height-10);

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
                transform: "translate(0," + (board.dDims.height +10) + ")"})
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
        .style({"opacity": function(d) {if(dryComfort(d.averageOf("DryBulbTemp"))<0)
                    return 0.25;
                  else return 0.75; },
              "fill": function(d) {
                  if(dryComfort(d.averageOf("DryBulbTemp"))<0) {return "steelblue";}
                  else return "tomato";},
              "visibility": "visible",
            })

        //Hovering Effects
        .on("mouseover", function(d,i) {d3.select(this).transition().style("fill", "gray");})
        // To return back to the original colors
        .on("mouseout", function(d,i) {d3.select(this).transition().style("fill",
            function(d) {
                if(dryComfort(d.averageOf("DryBulbTemp"))<0) {return "steelblue";}
                else {return "tomato";}
            }
        );})


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
                     return "[hour]" + "\nMonth: " + months[m] + "\nAverage Dry Bulb: " + d.averageOf("DryBulbTemp").toFixed(2) + " \xB0C" + "\nDegrees from Comfort Zone: " + (dryComfort(d.averageOf("DryBulbTemp"))).toFixed(2)+ " \xB0C" + "\nComfort Zone is between 20-24 \xB0C.";
                 })

        ;




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

        // ADDING LINE GRAPH

            board2 = dY.graph.addBoard("#dy-canvas",{inWidth: 100, inHeight:100, margin:30});
            board2.g.attr("id", "hideboard");

            var yMapAvg = function(d) { return yScale3(d.averageOf("DryBulbTemp")); }; // data -> display
            var yMapAvg2 = function(d) { return yScale3(d.averageOf("DewPtTemp")); }; // data -> display
            var yMapHigh = function(d) { return yScale3(d.maxOf("DryBulbTemp")); }; // data -> display
            var yMapLow = function(d) { return yScale3(d.minOf("DryBulbTemp")); }; // data -> display


            // setup x
            var xValue2 = function(d) { return d.hourOfDay(); }; // data -> value
            var xScale3 = d3.scale.linear()  // value -> display
                .domain([0,23])
                .range(board2.dDims.xRange);

            //label 1 - 24
            var xScale3a = d3.scale.linear()  // value -> display
                .domain([1,24])
                .range(board2.dDims.xRange);


            var xMap2 = function(d) { return xScale3(xValue2(d));}; // data -> display


            var xAxis2 = d3.svg.axis()
                .tickValues([1,4,8,12,16, 20, 24])
                // .ticks(6)
                .scale(xScale3a)
                .innerTickSize(-110)
                .outerTickSize(0)
                .tickPadding(5);


            // setup y
            var yScale3 = d3.scale.linear() // value -> display
                .domain([40,-10])
                .range((board2.dDims.yRange));

            var yAxis2 = d3.svg.axis()
                .scale(yScale3)
                .orient("left")
                .innerTickSize(0)
                .outerTickSize(-100)
                .tickPadding(0);

            var lineFunctionAvg = d3.svg.line()
                .x(xMap2)
                .y(yMapAvg)
                .interpolate("linear");

            var lineFunctionAvg2 = d3.svg.line()
                .x(xMap2)
                .y(yMapAvg2)
                .interpolate("linear");


            var areaFunctionHiLo = d3.svg.area()
                .x(xMap2)
                .y0(yScale3(yMapLow))
                .y1(yScale3(yMapHigh))
                .interpolate("linear");

            // x-axis
            board2.g.append("g")
                    .attr({
                        class: "x axis",
                        transform: "translate(0," + (board2.dDims.height +10) + ")",
                    })
                    .call(xAxis2);

            //change long ticks
            board2.g.selectAll(".tick:not(:first-of-type) line")
                .attr("fill", "blue")
                .attr("opacity", "0.25")
                .attr("stroke-dasharray", "3,2");



            // y-axis
            board2.g.append("g")
                    .attr({
                        class: "y axis",
                        transform: "translate(-10,0)"
                    })
                    .call(yAxis2)
                    .select(".domain").remove();

                // board2.g.append("path")
                //     .attr("d", areaFunctionHiLo(sticks))
                //     .attr("fill", "#ccc")
                //     .style("opacity", "0.50");


                // dry bulb
                board2.g.append("path")
                    .attr("class","path1")
                    .attr("d", lineFunctionAvg(sticks))
                    .attr("stroke", "slateblue")
                    .attr("stroke-width", 0.75)
                    .attr("fill", "none")
                    .append("title")
                    .text("Dry Bulb");

                // dew pt
                board2.g.append("path")
                    .attr("class","path2")
                    .attr("d", lineFunctionAvg2(sticks))
                    .attr("stroke", "darkolivegreen")
                    .attr("stroke-width", 0.75)
                    .attr("fill", "none")
                    .attr("visibility", "hidden")
                    .append("title");

                board2.g.append("text")
                    .attr("class", "textdry")
                    .attr("x", board2.dDims.width/2)
                    .attr("y", "-10")
                    .style("text-anchor", "middle")
                    .style("opacity", "0.75")
                    .style("font-size", "8px")
                    .style("font-family", "Tahoma, Geneva, sans-serif")
                    .text("Dry Bulb Temperature (\xB0C)");

                board2.g.append("text")
                    .attr("class", "textdew")
                    .attr("x", board2.dDims.width/2)
                    .attr("y", "-10")
                    .style("text-anchor", "middle")
                    .style("opacity", "0.75")
                    .style("font-size", "8px")
                    .style("font-family", "Tahoma, Geneva, sans-serif")
                    .text("Dew Bulb Temperature (\xB0C)")
                    .style("visibility", "hidden");



        }
}
