

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);

    var barPadding = 1;  // space between the bars
    var zoff = 10 // zero-offset in units of whatever value is plotted. this won't be required once we have a scale.
    var scale = 4 // scale of whatever value is plotted. this won't be required once we have a scale.

    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).
    board = dY.graph.addBoard("#dy-canvas", { inWidth: 400, inHeight: 200, margin: 30 });
    console.log(board);

    board.g.selectAll("rect")
        .data(dObj)
        .enter()
        .append("rect")
        .attr({
            class: "dryBulbMean",
            x: function (d, i) { return i * (board.dDims.width / dObj.length); },
            width: board.dDims.width / dObj.length - barPadding,
            y: function (d) { return board.dDims.height - (d.mean + zoff) * scale; },
            height: function (d) { return (d.mean + zoff) * scale; }
        });

}

