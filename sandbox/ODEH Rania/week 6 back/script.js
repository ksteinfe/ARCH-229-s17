

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // we'll plot monthlyTemperature as a 'step-before' curve, so we'll need to pop a duplicate value onto the front of the array of values we receive. Try commenting this out and see what happens
    for (var g in dObj.epwhead.ground){
        var first = dObj.epwhead.ground[g].monthlyTemperature[0] ;
        dObj.epwhead.ground[g].monthlyTemperature.unshift( first );
    }
    var mTempLen = dObj.epwhead.ground[0].monthlyTemperature.length; // the new number of values in the monthlyTemperature array.
    console.log(dObj);
    
    // summary information for each day of the year
    var dSum = dObj.dailySummary();
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:200, margin:40});
    //console.log(board);
      

    // Setup X
    var xScaleMnth = d3.scale.linear()  // value -> display
        .domain([0,mTempLen-1])
        .range((board.dDims.xRange));
        
    var xScaleHr = d3.scale.linear()  // value -> display
        .domain([0,8760])
        .range(board.dDims.xRange);     
        
    var xScaleTime = d3.time.scale()
        .domain([new Date(dY.dt.year, 0, 1), new Date(dY.dt.year, 11, 31)])
        .range(board.dDims.xRange);
        
    var xAxisMnth = d3.svg.axis()
        .scale(xScaleMnth)
        .orient('top');
        
    var xAxisTime = d3.svg.axis()
        .scale(xScaleTime)
        .orient('bottom')
        .ticks(d3.time.months) //should display 1 month intervals
        .tickSize(16, 0)
        .tickFormat(d3.time.format("%B"));        
       
      
    // Setup Y
    var yScale = d3.scale.linear() // value -> display
        .domain([50,0])
        .range((board.dDims.yRange)); 

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yMapAvg = function(d) { return yScale(d.averageOf("DryBulbTemp")) }; // data -> display
    var yMapHigh = function(d) { return yScale(d.q3Of("DryBulbTemp")) }; // data -> display
    var yMapLow = function(d) { return yScale(d.q1Of("DryBulbTemp")) }; // data -> display
        
    // Setup Color Scalse
    var cScale = d3.scale.linear()
    .domain([0,6])
    .interpolate(d3.interpolate)
    .range([d3.rgb("#aaa"), d3.rgb('#000')]);
        
        
        
        
    
    // Setup Line and Area Functions
        
    var lineFuncGroundTemp = d3.svg.line()
        .x(function(d,i){ return xScaleMnth(i); })
        .y(function(d){ return yScale(d); })
        .interpolate('step-before');
      
    var lineFunctionDryBulbAvg = d3.svg.line()
        .x( function(d){ return xScaleHr(d.hourOfYear()); } )
        .y(yMapAvg)
        .interpolate("linear");
        
    var areaFunctionDryBulbHiLo = d3.svg.area()
        .x( function(d){ return xScaleHr(d.hourOfYear()); } )
        .y0(yMapLow)
        .y1(yMapHigh)
        .interpolate("linear");   
      
      
      
      
    // draw x-axis
    board.g.append("g")
        .attr({
            class: "x axis"
        })
        .call(xAxisMnth)
        
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(0," + (board.dDims.height +10) + ")"
        })
        .call(xAxisTime)
        .selectAll(".tick text") // select all the text tags of style tick in the drawn axis
            .style("text-anchor", "start") // it seems D3 likes to set this style inline, so it can't be overridden by the CSS. We need to set here.
        
    // draw y-axis
    board.g.append("g")
        .attr({
            class: "y axis",
            transform: "translate(-10,0)"
        })
        .call(yAxis)
    
    // draw hi/low dry-bulb temperature area 
    board.g.append("path")
        .attr("d", areaFunctionDryBulbHiLo(dSum))
        .attr("class", "temp-area")     
      
    // draw average dry-bulb temperature 
    board.g.append("path")
        .attr("d", lineFunctionDryBulbAvg(dSum))
        .attr("class", "temp-average")       
        
    // draw some number of ground temperature step lines
    board.g.append("g")
        .attr("class", "groundline")
        .selectAll("path")
            .data(dObj.epwhead.ground)
            .enter().append("path")
                .attr("stroke", function(d){ return cScale(d.depth) ; })
                .datum(function(d){ return d.monthlyTemperature; })
                .attr( "d", lineFuncGroundTemp )

}

