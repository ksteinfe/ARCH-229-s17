

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);

    board = dY.graph.addBoard("#dy-canvas", { inWidth: 1100, inHeight: 200, margin: 50 });
    console.log(board);

    var scale = 2.5;

    var mean = function (d) { return d.mean; };
    var q0 = function (d) { return d.q0; };
    var q1 = function (d) { return d.q1; };
    var q2 = function (d) { return d.q2; };
    var q3 = function (d) { return d.q3; };
    var q4 = function (d) { return d.q4; };

    var radius = function (val) { return (val + 25) / Math.PI; }

    var circles = board.g.selectAll("circle").data(dObj[0]).enter();

    // Dry Bulb High
    circles.append("circle")
        .attr({
            class: "dryBulbHigh",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[0].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.25); },
            r: function (d) { return radius(q3(d)) * scale; }
        });

    // Dry Bulb Low
    circles.append("circle")
        .attr({
            class: "dryBulbLow",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[0].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.25); },
            r: function (d) { return radius(q1(d)) * scale; }
        });

    // Dry Bulb Mean
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[0].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.25); },
            r: function (d) { return radius(mean(d)) * scale; }
        });
    // Dry Bulb Max
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[0].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.25); },
            r: function (d) { return radius(q0(d)) * scale; }
        });
    // Dry Bulb Min
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[0].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.25); },
            r: function (d) { return radius(q4(d)) * scale; }
        });

    // Rel Hum High
    circles.append("circle")
        .attr({
            class: "dryBulbHigh",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[1].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.75); },
            r: function (d) { return radius(q3(d)) * scale; }
        });

    // Rel Hum Low
    circles.append("circle")
        .attr({
            class: "dryBulbLow",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[1].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.75); },
            r: function (d) { return radius(q1(d)) * scale; }
        });

    // Rel Hum Mean
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[1].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.75); },
            r: function (d) { return radius(mean(d)) * scale; }
        });
    // Rel Hum Max
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[1].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.75); },
            r: function (d) { return radius(q0(d)) * scale; }
        });
    // Rel Hum Min
    circles.append("circle")
        .attr({
            class: "dryBulbMean",
            cx: function (d, i) { return i * (board.dDims.width / (dObj[1].length - 1)); },
            cy: function (d) { return (board.dDims.height * 0.75); },
            r: function (d) { return radius(q4(d)) * scale; }
        });

}
