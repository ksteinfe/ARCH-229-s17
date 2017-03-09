

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");

    // Margin around Sun Path Diagram
    var margin = 50;
    // Radius of Sun Path Diagram
    var radius = 200
    // Art Board
    var board = dY.graph.addBoard("#dy-canvas", { inWidth: radius * 2, inHeight: radius * 2, margin: margin });

    // Board for SunPath
    var sunPath = board.g.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ") ");

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
        .radius(function (d) { return radScale(d.path.altitude); })
        .angle(function (d) { return angScale(d.path.azimuth); });

    // create bins
    var bins = [];
    var lat = dObj;
    var lon = dObj;
    for (var d = 0; d < 335; d += 30) {
        for (var h = 0; h < 23; h += 1) {
            var startDay = d;
            var endDay = d + 30;
            var startHour = h;
            var endHour = h + 1;

            var newBin = new bin(lat, lon, startDay, endDay, startHour, endHour);
            newBin.generateSolarGeo();
            bins.push(newBin);
        }
    }

    // draw the bins
    // sunPath.append("g").selectAll("path")
    //     .data(bins)
    //     .enter().append("path")
    //     .attr({
    //         d: pathLine,
    //         class: "valueline",
    //         stroke: function (d) { return cScale(d.value); }
    //     })
}

