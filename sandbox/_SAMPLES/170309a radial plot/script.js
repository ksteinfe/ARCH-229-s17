

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 45;
        //tick.data.EPW.WindSpd = 10;
    }
    
    console.log(dObj);
    
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 300, inHeight:300, margin:50});
    
    // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
    // also, since in this case we want a WindDir value of 0 to indicated North (which should be up), we can rotate this group such that the x-axis is pointing up. Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
    var ctrdGrp = board.g.append("g")
        .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ") rotate(-90)");
    
    var textPadding = 5;
    var ctrOffset = 20;
    
    // setup radius
    var radius = board.dDims.width / 2
    var radValue = function(d) { return d.valueOf("WindSpd"); }; // data -> value
    var radScale = d3.scale.linear()  // value -> display
        //.domain(dObj.metaOf("WindSpd").domain)
        .domain([0,20])
        .range([ctrOffset,radius]); 
    var radMap = function(d) { return radScale(radValue(d));}; // data -> display
      
    // setup angle
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
    var angValue = function(d) { return d.valueOf("WindDir"); }; // data -> value
    var angScale = d3.scale.linear() // value -> display
        .domain([0,360])
        .range([0,2*Math.PI]);
    var angMap = function(d) { return angScale(angValue(d));}; // data -> display
        
    // draw dots
    ctrdGrp.append("g").selectAll(".dot")
        .data(dObj.ticks)
        .enter().append("circle")
            .attr({
                class: "dot",
                r: 1.5,
                cx: function(d) { return( radMap(d)*Math.cos(angMap(d))); }  ,
                cy: function(d) { return( radMap(d)*Math.sin(angMap(d))); }  
            })        
      
    
    var radAxisGroups = ctrdGrp.append("g") // radAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to a value along the radial axis
        .attr("class", "radius axis")
      .selectAll("g")
        .data(radScale.ticks(4)) // bind a rough number of values of the radScale to this group, slicing the first one off to avoid having a value at the center
      .enter().append("g");

    radAxisGroups.append("circle") // append a circle to each
        .attr("r", radScale);
        
    radAxisGroups.append("line") // append a line to each 
        .attr("x2",  - (board.bDims.margin.bottom/2 + board.dDims.height/2) )
        .attr("y1", radScale)        
        .attr("y2", radScale);         

    radAxisGroups.append("text") // append some text to each
        .attr("x", function(d) { return radScale(d); }) // d in this case is a tick value along the radScale axis
        .text(function(d) { return d; })
        .attr("transform", "rotate(90) translate(0, "+( board.bDims.margin.bottom/2 + board.dDims.height/2)+")") // rotate to horizontal, translate to bottom of board
        .style("text-anchor", "middle");
        
        
    /*
    should have done this instead
    http://stackoverflow.com/questions/11254806/interpolate-line-to-make-a-half-circle-arc-in-d3    
    var arc = d3.svg.arc() // arcs are drawn by a different starting and ending degrees than we've plotted here
        .innerRadius(radius)
        .outerRadius(radius)
        .startAngle(-90 * (Math.PI/180)) //converting from degs to radians
        .endAngle(180 * (Math.PI/180)) //just radians

    ctrdGrp.append("path")
        .attr("class", "outer-radius axis")
        .attr("d", arc)
     */
        
        
    var angAxisGroups = ctrdGrp.append("g") // angAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to one of 12 values: angles between 0 and 360
        .attr("class", "angle axis")
      .selectAll("g")
        .data(d3.range(0, 360, 30)) // bind 12 data objects (0-360 in steps of x)
      .enter().append("g")
        .attr("transform", function(d) { return "rotate(" + d + ")"; }); // rotate each subgroup about the origin by the proper angle

    angAxisGroups.append("line") // append a line to each 
        .attr("x1", ctrOffset) // we only need to define x1 and x2, allowing y0 and y1 to default to 0
        .attr("x2", radius); 

    angAxisGroups.append("text") // append some text to each
        .attr("x", radius + textPadding*2)
        .attr("dy", textPadding/2) // nudge text down a bit
        .style("text-anchor", function(d) { return d > 180 ? "end" : null; })
        .attr("transform", function(d) { return d > 180 ? "rotate(180 " + (radius + textPadding*2) + ",0)" : null; })
        .text(function(d) { return d > 90 && d < 180 ? null: d ; });        
        
      
}

