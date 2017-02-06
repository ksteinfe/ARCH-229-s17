

function OnDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 200, inHeight:200, margin:40});
    //console.log(board);
      

    // setup x
    var xValue = function(d) { return d.data.EPW.DryBlb; }; // data -> value
    var xScale = d3.scale.linear().domain([-20,40]).range((board.dDims.xRange)); // value -> display
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var xAxis = d3.svg.axis()
        .scale(xScale);
      
    // setup y
    var yValue = function(d) { return d.data.EPW.RelHmd; }; // data -> value
    var yScale = d3.scale.linear().domain([100,0]).range((board.dDims.yRange)); // value -> display
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
      
    // x-axis
    board.g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (board.dDims.height +10) + ")")
            .style("font-size","8px")
            .call(xAxis)

    // y-axis
    board.g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-10,0)")
            .style("font-size","8px")
            .call(yAxis) 
      
    // draw dots
    board.g.selectAll(".dot")
        .data(dObj.hrs)
        .enter().append("circle")
            .attr("class", "dot")
            //.attr("class", function(d){ if (d.data.EPW.DewPt > 0) {return "dot high-dew"} else {return "dot low-dew"}  })
            .attr("r", 1.5)
            .attr("cx", function(d) { return xMap(d);})
            .attr("cy", function(d) { return yMap(d);});
      
}

