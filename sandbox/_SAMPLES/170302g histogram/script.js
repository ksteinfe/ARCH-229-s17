

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 600, inHeight:200, margin:40});
    //console.log(board);    
    
    // Setup Bins
    // Here we construct a new dataset "bins" which represents the distribution of data by grouping discrete data points into bins
    // To use the d3 histogram() layout, we'll first need an array of values to bin
    
    // Here we build an array of values to bin using the JavaScript map() method of arrays.
    var key = "DryBulbTemp" // try these: DryBulbTemp HorzVis OpqSkyCvr SnowDepth
    var vals = dObj.ticks.map(function(d) {return d.valueOf(key);});
    /*
    // the above statement is equivalent to:  
    var vals = [];
    for (var t in dObj.ticks) { vals.push( dObj.ticks[t].valueOf("DryBulbTemp") ) }
    */
    console.log(vals);
    //console.log(d3.extent(vals));
    
    
    // we'll use this scale to define nicely spaced bins for our data
    var binScale = d3.scale.linear()
        .domain(d3.extent(vals)).nice() // the nice() method called here extends the domain out to round numbers
        .range(board.dDims.xRange);
        
    // now we bin our data
    var binCount = 20;
    var bins = d3.layout.histogram()
        .range(d3.extent(vals)) // we can also set a range explicitly, as in .range([0,10])
        .bins(binScale.ticks(binCount)) // recall that ticks() is a rough count, and that d3 finds pretty divisions of the domain of the scale. We can also set the bins explicitly, as in .bins([0,2,4,6,8]), or specify the number of bins we want, as in .bins(4), but then lose control of where the thresholds are placed
        (vals); // passes our array of values to the binning function, and returns binned data ready to plot
    
    console.log(bins);
     
     
     
    // Let's Draw!
    // Here are some variables we'll need
     var barPad = 3; // padding between the displayed bars
     var barWidth = board.dDims.width / bins.length - barPad ; // width of the the displayed bars
     var textInBarThresh = 50 ; // counts below this value will show up above bars, while counts above will show up inside bars
     var barTooNarrowForTextThresh = 20 ; // we won't plot text if bars are thinner than this
     var textOfst = 15 ; // approximate text height (actual height set in CSS)
     var yScaleToCounts = true; 

     // setup x
    var xMap = function(d) { return binScale(d.x) + barPad/2;}; // data -> display    
    
    var xAxis = d3.svg.axis()
        .ticks(binCount)
        .scale(binScale);    
        
    // setup y     
    var maxCount = d3.max(bins, function(d) { return d.y; }) ;
    var yScale = d3.scale.linear()  // value -> display
        .domain( [maxCount,0] ).nice()
        .range(board.dDims.yRange);
        
    var yAxis = d3.svg.axis()
        .orient("left")
        .scale(yScale)
                
    if (!yScaleToCounts){
        yScale.domain([8760,0]) 
        yAxis.tickValues([0,maxCount,8760]);
    }
    var yMap = function(d) { return yScale(d.y);}; // data -> display    
        

    
      
    // draw the x-axis
    board.g.append("g")
        .attr({
            class: "x axis",
            transform: "translate(0," + (board.dDims.height +10) + ")"
        })
        .call(xAxis)      
        
    // draw the y-axis
    board.g.append("g") // appends a new group to the board
        .attr({
            class: "y axis",
            transform: "translate(-10,0)" // moves this group a bit to the left
        })
        .call(yAxis)         
        
        
    // draw the bars
    var binGroups = board.g.append("g").selectAll("rect") // a new group for each bar
        .data(bins)
        .enter()
        .append("g")
        .attr("class", "bar")
    
    binGroups.append("rect") // append a rect to each group
        .attr({
            class: "bar",
            x: function(d) { return xMap(d); },            
            width: barWidth,
            y: function(d) { return yMap(d); },
            height: function(d) { return board.dDims.height - yMap(d); }
        });
        
    if (barWidth > barTooNarrowForTextThresh){
        binGroups.append("text") // append some text to each group
            .text(function(d) { return d.length; }) 
            .style("text-anchor", "middle")       
            .attr({
                x: function(d) { return xMap(d) + barWidth/2; },
                y: function(d) { return yMap(d); },
                dy: function(d) { return d.length > textInBarThresh ? textOfst : -textOfst/4; }, // ooh! an in-line if-else!
                class: function(d) { return d.length > textInBarThresh ? "in-bar" : "above-bar"; } // ooh! an in-line if-else!
            });  
    }
}

