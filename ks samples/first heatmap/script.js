

function OnDataLoaded(darr) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(darr);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:120, margin:50});
    console.log(board);
    

    // setup x 
    var xValue = function(d) { return d.dayOfYear(); }; // data -> value
    var xScale = d3.scale.linear().domain([0, 364]).range(board.dDims.xRange); // value -> display
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var dayScale = d3.time.scale()
        .domain([new Date(dY.datetime.year, 0, 1), new Date(dY.datetime.year, 11, 31)])
        .range(board.dDims.xRange);
    var xAxis = d3.svg.axis()
        .scale(dayScale)
        .orient('bottom')
        .ticks(d3.time.months)//should display 1 year intervals
        .tickSize(16, 0)
        .tickFormat(d3.time.format("%B"));

    // setup y
    var yValue = function(d) { return d.hourOfDay();}; // data -> value
    var yScale = d3.scale.linear().domain([0,23]).range((board.dDims.yRange)); // value -> display
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickValues([0,6,12,18,23]);
     
    // dimension of a single heatmap rectangle
    var pixelDim = [ board.dDims.width / 365,  board.dDims.height / 24];
    console.log(pixelDim);

    // setup fill color
    zonekey = ["Environment","Outdoor Dry Bulb [C](Hourly)"];
    //zonekey = ["ZONE1","Zone People Number Of Occupants [](Hourly)"];
    //zonekey = ["ZONE1","Zone Mean Air Temperature [C](Hourly)"];
    var cValue = function(d) { return d.valueOf(zonekey)};
    var color = d3.scale.linear().domain(darr.metaOf(zonekey).domain)
          .interpolate(d3.interpolate)
          .range([d3.rgb("#0000ff"), d3.rgb('#ff0000')]);
        
        // x-axis
        board.g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (board.dDims.height +10) + ")")
                .style("font-size","8px")
                .call(xAxis)
            .selectAll(".tick text")
                .style("text-anchor", "start")
                .attr("x", 6)
                .attr("y", 6)

        // y-axis
        board.g.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(-10,0)")
                .style("font-size","8px")
                .call(yAxis) 

        // draw dots
        board.g.selectAll(".dot")
            .data(darr.hrs)
            .enter().append("rect")
                .attr("class", "dot")
                .attr("width", pixelDim[0])
                .attr("height", pixelDim[1])
                .attr("x", function(d) { return xMap(d);})
                .attr("y", function(d) { return yMap(d);})
                .attr("transform", "translate("+pixelDim[0]*-0.5+","+pixelDim[1]*-0.5+")")
                .style("fill", function(d) { return color(cValue(d));}) ;
      
}

