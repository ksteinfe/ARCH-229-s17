

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
        .attr("transform", "translate(" + radius + "," + radius + ") ")
        .attr({ class: "sunpath" });

    // Scales the value to polar coordinate theta
    var angScale = d3.scale.linear()
        .domain([0, 2 * Math.PI])
        .range([0, 2 * Math.PI]);

    // Scales the value to polar coordinate r
    var radScale = d3.scale.linear()
        .domain([Math.PI, 0])
        .range([0, radius]);

    // Draw Value Paths
    var pathLine = d3.svg.line.radial()
        .radius(function (d) { return radScale(d.altitude); })
        .angle(function (d) { return angScale(d.azimuth); })
        .interpolate("basis-closed");

    // create bins
    var bins = [];

    var lat = dObj.location.latitude;
    var lon = dObj.location.longitude;
    var tmz = dObj.location.timezone;


    // Testing
    var startDay = 85;
    var endDay = 105;
    var startHour = 10;
    var endHour = 14;

    var newBin = new bin(lat, lon, tmz, startDay, endDay, startHour, endHour);

    console.log(newBin.binIsVisible());

    if (newBin.binIsVisible()) {
        bins.push(newBin);
        newBin.generateSolarGeo();
    }

    console.log(bins);


    // for (var d = 0; d < 335; d += 300) {
    //     for (var h = 0; h < 23; h += 24) {
    //         var startDay = d;
    //         var endDay = d + 30;
    //         var startHour = h;
    //         var endHour = h + 1;

    //         var newBin = new bin(lat, lon, tmz, startDay, endDay, startHour, endHour);
    //         newBin.generateSolarGeo();
    //         bins.push(newBin);
    //     }
    // }

    // draw the bins
    sunPath.append("g").selectAll("path")
        .data(bins)
        .enter().append("path")
        .datum(function (d) { return d.path; })
        .attr({
            d: pathLine,
            class: "bin",
            stroke: "red",
            fill: "none"
        });


    console.log(sunPath);
}

