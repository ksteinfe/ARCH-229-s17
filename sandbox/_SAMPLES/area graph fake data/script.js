

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 730, inHeight:200, margin:40});
    //console.log(board);
    
    
    // setup x
    var xValue = function(d) { return d.midTick; }; // data -> value
    var xScale = d3.scale.linear()  // value -> display
        .domain([0,12])
        .range(board.dDims.xRange);
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
        
        
    var xMap  =  function(d,i) { return xScale(i);}; // data -> display
    var yMapHigh = function(d) { return yScale(30) }; // data -> display
    var yMapLow = function(d) { return yScale(d.val) }; // data -> display
     
    var areaFunctionHiLo = d3.svg.area()
        .x(xMap)
        .y0(yMapLow)
        .y1(yMapHigh)
        .interpolate("linear");  
        
    dSum = [
        {val:10},
        {val:10},
        {val:10},
        {val:12},
        {val:20},
        {val:12},
        {val:10},
        {val:10},
        {val:10},
        {val:10}
    ];
        
        
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
        
}

