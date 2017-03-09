

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");

    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 50;
        //tick.data.EPW.WindSpd = 10;
    }
    //console.log(dObj);


    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).
    var margin = 50;
    var radius = 200
    var board = dY.graph.addBoard("#dy-canvas", { inWidth: radius * 2 * 2 + margin, inHeight: radius * 2, margin: margin });


    // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
    var ctrdGrpWntr = board.g.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ") ");

    var ctrdGrpSumr = board.g.append("g")
        .attr("transform", "translate(" + (radius * 3 + margin) + "," + radius + ") ");




    // Setup Scales and Maps to nest data and do a solar plot

    // Setup Angular Axis
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
    var angValue = function (d) { return d.azimuthDeg; }; // data -> value
    var angScale = d3.scale.linear() // value -> display
        .domain([0, 360])
        .range([0, 2 * Math.PI]); // an angle of 0 should be pointing up toward the top of the canvas.

    // Setup Radial Axis
    //
    var radValue = function (d) { return d.altitudeDeg; }; // data -> value
    var radScale = d3.scale.linear()  // value -> display
        //.domain(dObj.metaOf("WindSpd").domain)
        .domain([90, 0])
        .range([0, radius]);


    // Setup Color
    //
    var cScale = d3.scale.linear()
        .domain([-5, 35])
        .interpolate(d3.interpolate)
        .range([d3.rgb("#0000ff"), d3.rgb('#ff0000')]);



    // Draw Value Paths
    //
    var valLine = d3.svg.line.radial()
        .radius(function (d) { return radScale(d.altitudeDeg); })
        .angle(function (d) { return angScale(d.azimuthDeg); });

    // calculate solar geom near every given tick
    // and enrich results with value taken from tick (in this case, DryBulbTemp)
    var sGeom = dObj.ticks.map(function (tick) {
        var result = dY.solarGeom.geomNearHourOfYear(dObj.location, tick.hourOfYear);
        result.data.value = tick.valueOf("DryBulbTemp"); // i wish i could bind this to the result itself (up one level) but can't figure how to refer to that later
        return result;
    });

    var filteredForSunup = sGeom.filter(function (d) { return d.sunUpPercent > 0.3; });
    var filteredForWntr = filteredForSunup.filter(function (d) { return dY.timeSpan.hourOfYear(d.hourOfYear).season() <= 1; }); // looks for season values of 0 or 1 (winter or spring)
    var filteredForSumr = filteredForSunup.filter(function (d) { return dY.timeSpan.hourOfYear(d.hourOfYear).season() >= 2; }); // looks for season values of 2 or 3 (summer or fall)


    console.log(filteredForWntr);
    ctrdGrpWntr.append("g").selectAll("path")
        .data(filteredForWntr)
        .enter().append("path")
        .datum(function (d) { return d.data; })
        .attr({
            d: valLine,
            class: "valueline",
            stroke: function (d) { return cScale(d.value); }
        })


    ctrdGrpSumr.append("g").selectAll("path")
        .data(filteredForSumr)
        .enter().append("path")
        .datum(function (d) { return d.data; })
        .attr({
            d: valLine,
            class: "valueline",
            stroke: function (d) { return cScale(d.value); }
        });



    // Draw Analemma
    //
    drawAnalemma(dObj.location, radScale, angScale, ctrdGrpWntr, ctrdGrpSumr);


    var axisWntr = ctrdGrpWntr.append("g").attr("class", "axis")
    axisWntr.append("circle")
        .attr({
            r: radius
        });

    var axisSumr = ctrdGrpSumr.append("g").attr("class", "axis")
    axisSumr.append("circle")
        .attr({
            r: radius
        });
}


function drawAnalemma(location, radScale, angScale, gWntr, gSumr) {
    var analemmaData = [];
    for (var h = 0; h < 24; h++) analemmaData.push(dY.solarGeom.dailyAtGivenHour(location, h));

    var analemmaLine = d3.svg.line.radial()
        .radius(function (d) { return radScale(d.altitudeDeg); })
        .angle(function (d) { return angScale(d.azimuthDeg); });

    var gFrontWntr = gWntr.append("g").attr("class", "analemma front");
    var gBackWntr = gWntr.append("g").attr("class", "analemma back");
    var gFrontSumr = gSumr.append("g").attr("class", "analemma front");
    var gBackSumr = gSumr.append("g").attr("class", "analemma back");

    for (var ana in analemmaData) {
        var filteredForSunup = analemmaData[ana].data.filter(function (d) { return d.altitudeDeg > 0; });
        var filteredForWntr = filteredForSunup.filter(function (d) { return dY.timeSpan.dayOfYear(d.dayOfYear).season() <= 1; }); // looks for season values of 0 or 1 (winter or spring)
        var filteredForSumr = filteredForSunup.filter(function (d) { return dY.timeSpan.dayOfYear(d.dayOfYear).season() >= 2; }); // looks for season values of 2 or 3 (summer or fall)
        //console.log(filteredForSunup);


        if (filteredForWntr.length > 0) {
            var grouped = dY.util.splitAtDiscontinuousHours(filteredForWntr, "dayOfYear");
            for (var g in grouped) {
                gFrontWntr.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
                gBackSumr.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
            }
        }
        if (filteredForSumr.length > 0) {
            var grouped = dY.util.splitAtDiscontinuousHours(filteredForSumr, "dayOfYear");
            for (var g in grouped) {
                gBackWntr.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
                gFrontSumr.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
            }
        }


    }
}

