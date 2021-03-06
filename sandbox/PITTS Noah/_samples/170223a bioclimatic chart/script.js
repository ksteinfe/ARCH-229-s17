

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 200, inHeight:200, margin:40});
    //console.log(board);
      

    // setup x
    var xValue = function(d) { return d.valueOf("DryBulbTemp"); }; // data -> value
    var xScale = d3.scale.linear()  // value -> display
        .domain([-20,40])
        .range((board.dDims.xRange));
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var xAxis = d3.svg.axis()
        .scale(xScale);
      
    // setup y
    var yValue = function(d) { return d.valueOf("RelHumid"); }; // data -> value
    var yScale = d3.scale.linear() // value -> display
        .domain([100,0])
        .range((board.dDims.yRange)); 
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
      
    // x-axis
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(0," + (board.dDims.height +10) + ")"
        })
        .call(xAxis)

    // y-axis
    board.g.append("g")
        .attr({
            class: "y axis",
            transform: "translate(-10,0)"
        })
        .call(yAxis)
      
    // draw dots
    board.g.selectAll(".dot")
        .data(dObj.ticks)
        .enter().append("circle")
            .attr({
                class: "dot",
                //class: function(d){ if (d.data.EPW.DewPt > 0) {return "dot high-dew"} else {return "dot low-dew"}  },
                r: 1.5,
                cx: function(d) { return xMap(d);} ,
                cy: function(d) { return yMap(d);} ,
            })        
      
}

