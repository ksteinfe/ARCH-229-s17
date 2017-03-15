

var myOwnAdapter = {    
    init : function ( element ) { },
    start : function ( element ){ return parseInt ( element.node.textContent, 10 ); }, 
    change : function ( element, value ) { 
      value = value > 1 ? value : 1;
      value = value < 12 ? value : 12;
      element.node.textContent = value;
      
      // fires an event to redraw the main graph
      redrawGraph(value - 1);
    },
    end : function ( element ) { }
};

new Scrubbing ( 
    document.querySelector ( '#scrubbing') , 
    { 
        driver : [ Scrubbing.driver.Mouse, Scrubbing.driver.MouseWheel, Scrubbing.driver.Touch ],
        resolver : Scrubbing.resolver.HorizontalProvider ( 30 ), 
        adapter : myOwnAdapter        
    }
);




var diurnalNest = false;

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    //console.log(dObj);
    
    diurnalNest = d3.nest()
        .key(function(d) { return d.monthOfYear(); })
        .rollup(function(d) { return dY.hourOfDaySummary(dObj.schema, d ); })
        .entries(dObj.ticks);
        
    redrawMonth(0);
}


function redrawGraph(m){
    if (!diurnalNest){
        console.log("not ready");
        return false;
    }
    var mth = dY.dt.monthTable[m];
    var sticks = diurnalNest[m].values;
    //console.log(mth);
    //console.log(sticks);

    // remove any existing boards from the canvas
    d3.select("#dy-canvas").selectAll(".board").remove()
    
    // add a board (an SVG) to the canvas.  
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 400, inHeight:400, margin:30});
        
    // setup x
    var xValue = function(d) { return d.hourOfDay(); }; // data -> value
    var xScale = d3.scale.linear()  // value -> display
        .domain([0,23])
        .range(board.dDims.xRange);
                    
    var xMap = function(d) { return xScale(xValue(d));}; // data -> display
    var xAxis = d3.svg.axis()
        .tickValues([0,12,23])
        .scale(xScale);        
      
    // setup y
    var yScale = d3.scale.linear() // value -> display
        .domain([40,-20])
        .range((board.dDims.yRange)); 
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(4)
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
        .attr("d", areaFunctionHiLo(sticks))
        .attr("fill", "#ccc");      
      
    board.g.append("path")
        .attr("d", lineFunctionAvg(sticks))
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("fill", "none");
      

            
        
        
}