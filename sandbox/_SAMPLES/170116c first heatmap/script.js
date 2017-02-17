

function onDataLoaded(dObj) {
    //dObj.ticks = dObj.ticks.slice(0,744);
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:120, margin:50});
    

    // Setup X
    //
    var xValue = function(d) { return d.dayOfYear(); }; // data -> value
    var xScale = d3.scale.linear() // value -> display
        .domain([0, 364])
        .range(board.dDims.xRange); 
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var dayScale = d3.time.scale()
        .domain([new Date(dY.datetime.year, 0, 1), new Date(dY.datetime.year, 11, 31)])
        .range(board.dDims.xRange);
    var xAxis = d3.svg.axis()
        .scale(dayScale)
        .orient('bottom')
        .ticks(d3.time.months) //should display 1 month intervals
        .tickSize(16, 0)
        .tickFormat(d3.time.format("%B"));

    // Setup Y
    // 
    var yValue = function(d) { return d.hourOfDay();}; // data -> value
    var yScale = d3.scale.linear()  // value -> display
        .domain([23,0])
        .range((board.dDims.yRange));
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickValues([0,6,12,18,23]); // we can explicitly set tick values this way
     
    // dimension of a single heatmap rectangle
    var pixelDim = [ board.dDims.width / 365,  board.dDims.height / 24 ];
    
    
    // Setup Color
    //
    zonekey = "DryBulbTemp";
    //zonekey = ["ZONE1","Zone People Number Of Occupants [](Hourly)"];
    //zonekey = ["ZONE1","Zone Mean Air Temperature [C](Hourly)"];
    var cValue = function(d) { return d.valueOf(zonekey)};
    var cScale = d3.scale.linear()
        .domain(dObj.metaOf(zonekey).domain)
        .interpolate(d3.interpolate)
        .range([d3.rgb("#0000ff"), d3.rgb('#ff0000')]);
    var cMap = function(d) { return cScale(cValue(d));}; // data -> display
    
    
    // draw x-axis        
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(0," + (board.dDims.height +10) + ")" // move the whole axis down a bit
        })
        .call(xAxis)
        .selectAll(".tick text") // select all the text tags of style tick in the drawn axis
            .style("text-anchor", "start") // it seems D3 likes to set this style inline, so it can't be overridden by the CSS. We need to set here.
            
    // draw y-axis
    board.g.append("g")
        .attr({
            class: "y axis",
            transform: "translate(-10,0)" // move the whole axis to the left a bit
        })
        .call(yAxis)

    // draw pixels
    board.g.selectAll("rect")
        .data(dObj.ticks)
        .enter().append("rect")
            .attr({
                class: "pxl",
                width: pixelDim[0],
                height: pixelDim[1],
                x: function(d) { return xMap(d);},
                y: function(d) { return yMap(d);},
                transform: "translate("+pixelDim[0]*-0.5+","+pixelDim[1]*-0.5+")",
                fill: function(d) { return cMap(d);}
            });
      
}

