

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    // create a location object
    var location = {
        lat: dObj.location.latitude,
        lon: dObj.location.longitude,
        tmz: dObj.location.timezone
    };

    // Margin around Sun Path Diagram
    var margin = 50;
    // Radius of Sun Path Diagram
    var radius = 200
    // Art Board
    var board = dY.graph.addBoard("#dy-canvas", { inWidth: radius * 2, inHeight: radius * 2, margin: margin });

    // Board for SunPath
    var sunPath = board.g.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ") ")
        .attr({ class: "background" });

    // Scale color
    var cScale = d3.scale.linear()
        .domain([-10, 10])
        .interpolate(d3.interpolate)
        .range([d3.rgb("#20ccee"), d3.rgb('#303030')]);

    // Scales the value to polar coordinate theta
    var angScale = d3.scale.linear()
        .domain([0, 360])
        .range([0, 2 * Math.PI]);

    // Scales the value to polar coordinate r
    var radScale = d3.scale.linear()
        .domain([90, 0])
        .range([0, radius]);

    // Draw Value Paths
    var pathLine = d3.svg.line.radial()
        .radius(function (d) { return radScale(d.altitudeDeg); })
        .angle(function (d) { return angScale(d.azimuthDeg); })
        .interpolate("linear");

    // create bins
    var bins = [];




    // Testing
    // var startDay = 85;
    // var endDay = 105;
    // var startHour = 10;
    // var endHour = 14;

    // var newBin = new bin(lat, lon, tmz, startDay, endDay, startHour, endHour);

    // console.log(newBin.binIsVisible());

    // if (newBin.binIsVisible()) {
    //     bins.push(newBin);
    //     newBin.generateSolarGeo();
    // }


    console.log(dObj);

    var dayStep = 21;
    var hourStep = 1 / 3;

    for (var d = 0; d < 351; d += dayStep) {
        for (var h = 0; h < 22; h += hourStep) {
            var newBin = new bin(location, d, d + dayStep, h, h + hourStep);
            if (newBin.isVisible()) {
                newBin.generateSolarPath(5);

                // iterate over data values in range
                var val = 0;
                var count = 0;
                for (var d_v = Math.floor(d); d_v < Math.floor(d) + dayStep; d_v++) {
                    for (var h_v = Math.floor(h); h_v < Math.floor(h) + hourStep; h_v++) {
                        // sum data over range
                        var dayOfYear = d_v * 24 + h_v;
                        var tick = dObj.ticks[dayOfYear];
                        val += tick.valueOf("DryBulbTemp");
                        count++;
                    }
                }
                // average the data value
                newBin.solarPath.value = 25 - val / count;
                bins.push(newBin);
            }
        }
    }
    console.log(bins);

    // draw the circle
    var axisCirc = sunPath.append("g").attr("class", "axis")
    axisCirc.append("circle")
        .attr({
            cx: 3.5,
            r: radius
        });

    // draw the bins
    sunPath.append("g").selectAll("path")
        .data(bins)
        .enter().append("path")
        .datum(function (d) { return d.solarPath; })
        .attr({
            d: pathLine,
            class: "bin",
            fill: function (d) { return cScale(d.value); }
        });




    console.log(solarTime(location, 150, 13));
}

