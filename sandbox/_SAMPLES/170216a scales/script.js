

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    var barPadding = 1;  // space between the bars
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).    
    board = dY.graph.addBoard("#dy-canvas",{inWidth:400, inHeight:200,margin:40});
    console.log(board);  
    
    // We define yValue as a function that, given a data item, returns the proper value for this axis
    var yValue = function(d) { return d.mean; }; // data -> value   
    
    // We define yScale as a D3 scale function that, given a value in one domain (the domain of values taken from our data), returns a coordinate on the canvas (a location within the drawing dimensions of our board). 
    // Recall that x-coordinates move from left to right and y-coordinates move from top to bottom.
    var yScale = d3.scale.linear()  // value -> display
        .domain([28,-15])
        .range((board.dDims.yRange));
    
    // We define yMap as a combination of the two functions defined above.
    // A function that, given a data item, returns a coordinate on the canvas
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    
    // D3 will draw an axis to the canvas for us - ticks, labels and all!
    var yAxis = d3.svg.axis()
        .scale(yScale)
        //.ticks(4)
        //.tickValues([0,-15,30])
        .orient("left");
    
    // draw the y-axis
    board.g.append("g") // appends a new group to the board
        .attr({
            class: "y axis",
            transform: "translate(-10,0)" // moves this group a bit to the left
        })
        .call(yAxis) 
    
    // draw the bars
    board.g.append("g").selectAll("rect")
        .data(dObj)
        .enter()
        .append("rect")
        .attr({
            class: "bar",
            x: function(d, i) { return i * (board.dDims.width / dObj.length); },            
            width: board.dDims.width / dObj.length - barPadding,
            y: function(d) { return yMap(d); },
            height: function(d) { return board.dDims.height - yMap(d); }
        });
      
}

