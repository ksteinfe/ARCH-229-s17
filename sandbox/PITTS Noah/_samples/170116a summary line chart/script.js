

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // summary information for each day of the year
    var dSum = dObj.dailySummary(4);
    console.log(dSum);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:200, margin:40});
    //console.log(board);
        
    // setup x
    var xValue = function(d) { return d.hourOfYear(); }; // data -> value
    var xScale = d3.scale.linear()  // value -> display
        .domain([0,8760])
        .range((board.dDims.xRange));
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var xAxis = d3.svg.axis()
        .scale(xScale);        
      
    // setup y
    var yScale = d3.scale.linear() // value -> display
        .domain([40,-20])
        .range((board.dDims.yRange)); 
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
        
    var yMapAvg = function(d) { return yScale(d.averageOf("DryBulbTemp")) }; // data -> display
    var yMapHigh = function(d) { return yScale(d.maxOf("DryBulbTemp")) }; // data -> display
    var yMapLow = function(d) { return yScale(d.minOf("DryBulbTemp")) }; // data -> display
        
    var lineFunctionAvg = d3.svg.line()
        .x(xMap)
        .y(yMapAvg)
        .interpolate("linear");
        
    var areaFunctionHiLo = d3.svg.area()
        .x(xMap)
        .y0(yMapLow)
        .y1(yMapHigh)
        .interpolate("linear");   
        
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
      
    board.g.append("path")
        .attr("d", areaFunctionHiLo(dSum))
        .attr("fill", "#ccc");      
      
    board.g.append("path")
        .attr("d", lineFunctionAvg(dSum))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");
      

      
}

