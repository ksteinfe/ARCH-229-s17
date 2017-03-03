

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    // FIRST GRAPHIC
    //
    
    // add a board (an SVG) to the canvas.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:120, margin:50});

    // Setup Color
    //
    zonekey = "DryBulbTemp";
    cValue = function(d) { return d.valueOf(zonekey)};
    cScale = d3.scale.linear()
        .domain([-25,45])
        .interpolate(d3.interpolate)
        .range([d3.rgb("#fff"), d3.rgb('#000')]);
        
    cMap = function(d) { return cScale(cValue(d)) }
    
    // draw a heatmap to the board
    drawHeatmap(dObj, board, cMap) 
    
    
    
    // SECOND GRAPHIC
    //
    
    // add another board (an SVG) to the canvas.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:120, margin:50});
    
    // Setup Color
    //
    zonekey = "RelHumid";
    cValue = function(d) { return d.valueOf(zonekey)};
    cScale = d3.scale.linear()
        .domain([0,100])
        .interpolate(d3.interpolate)
        .range([d3.rgb("#fff"), d3.rgb('#000')]);
        
    cMap = function(d) { return cScale(cValue(d)) }
    
    // draw another heatmap to the board
    drawHeatmap(dObj, board, cMap)     
    

    
    // THIRD GRAPHIC
    //
    
    // add another board (an SVG) to the canvas.
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:120, margin:50});
    
    // Setup Color
    //
    keyA = "DryBulbTemp";
    keyB = "RelHumid";
    scaleAWhenBHigh = d3.scale.linear().interpolate(d3.interpolate).domain([-25,45]).range([d3.rgb("#00f"), d3.rgb('#f00')]);
    scaleAWhenBLow = d3.scale.linear().interpolate(d3.interpolate).domain([-25,45]).range([d3.rgb("#fff"), d3.rgb('#ff0')]);
    scaleB = d3.scale.linear().interpolate(d3.interpolate).domain([0,100]);
    cMap = function(d) { 
        a = d.valueOf(keyA);
        b = d.valueOf(keyB);
        colorLow = scaleAWhenBLow(a);
        colorHigh = scaleAWhenBHigh(a);
        scaleB.range([colorLow, colorHigh]);
        return scaleB(b);
    }
    
    // draw another heatmap to the board
    drawHeatmap(dObj, board, cMap)         
    
}



function drawHeatmap(dObj, board, colorMap) {
    
    // Setup X
    //
    var xValue = function(d) { return d.dayOfYear(); }; // data -> value
    var xScale = d3.scale.linear() // value -> display
        .domain([0, 364])
        .range(board.dDims.xRange); 
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var dayScale = d3.time.scale()
        .domain([new Date(dY.dt.year, 0, 1), new Date(dY.dt.year, 11, 31)])
        .range(board.dDims.xRange);
    var xAxis = d3.svg.axis()
        .scale(dayScale)
        .orient('bottom')
        .ticks(d3.time.months)//should display 1 year intervals
        .tickSize(16, 0)
        .tickFormat(d3.time.format("%b"));

    // Setup Y
    // 
    var yValue = function(d) { return d.hourOfDay();}; // data -> value
    var yScale = d3.scale.linear()  // value -> display
        .domain([0,23])
        .range((board.dDims.yRange));
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickValues([0,6,12,18,23]); // we can explicitly set tick values this way
     
    // dimension of a single heatmap rectangle
    var pixelDim = [ board.dDims.width / 365,  board.dDims.height / 24 ];
    
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
                fill: function(d) { return colorMap(d);}
            });
            
}
