

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 50;
        //tick.data.EPW.WindSpd = 10;
    }
    
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 300, inHeight:300, margin:50});
    
    // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
    var ctrdGrp = board.g.append("g")
        .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ") ");
        

    var ctrOffset = 40;
    var radius = board.dDims.width / 2
    var qStep = [10,1] // alters how the data is nested. Angular axis is nested by steps of the first value, radial axis is chopped by steps of the second value
    
    
    // Setup Scales and Maps to nest data and do a radial plot of ponits
    
    // Setup Angular Axis
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.    
    var angValue = function(d) { return d.valueOf("WindDir"); }; // data -> value
    var angMap = function(d) { return angScale(angValue(d));}; // data -> display    
    var angScale = d3.scale.linear() // value -> display
        .domain([0,360])
        .range([-0.5*Math.PI, 1.5*Math.PI]); // an angle of 0 should be pointing up toward the top of the canvas.
    
    // This quantized scale is for nesting data by angular values
    var qDirScale = d3.scale.quantize() 
        .domain([1,360]) // a starting angle of a bit more than 0 works better than 0. I think it's a <= thing.
        .range(d3.range(0, 360, qStep[0]));        
        
        
    // Setup Radial Axis
    // 
    var radValue = function(d) { return d.valueOf("WindSpd"); }; // data -> value
    var radScale = d3.scale.linear()  // value -> display
        //.domain(dObj.metaOf("WindSpd").domain)
        .domain([0,20])
        .range([ctrOffset,radius]);
    var radMap = function(d) { return radScale(radValue(d));}; // data -> display        
    
    // This quantized scale is for nesting data by radial values
    var qSpdScale = d3.scale.quantize() 
        .domain([0,20])
        .range(d3.range(0, 20, qStep[1]));


    // Setup Color
    var clrScale = d3.scale.linear()
        .domain([0,100])
        .interpolate(d3.interpolate)
        .range([d3.rgb("#eee"), d3.rgb('#000')]);
    
    
    
    
    // nest data
    var nestedData = d3.nest()
        .key(function(d) { return qDirScale(d.valueOf("WindDir")); })
        .key(function(d) { return qSpdScale(d.valueOf("WindSpd")); })
        .rollup(function(d) { return d.length; })
        .entries(dObj.ticks);
    
    // enrich nested data
    for (var dir in nestedData) {
        windDir =  parseFloat(nestedData[dir].key)
        for (var spd in nestedData[dir].values) {
            obj = nestedData[dir].values[spd]
            windSpd =  parseFloat(obj.key)
            obj.windDir = [windDir,windDir+qStep[0]]
            obj.windSpd = [windSpd,windSpd+qStep[1]]
            
            // setup data for arcs
            // d3 arcs are drawn by angles starting at 0 at the top and proceeding clockwise
            // assigning these members to our data objects will allow them to be passed along to each arc plotted
            obj.startAngle = obj.windDir[0] * Math.PI/180
            obj.endAngle = obj.windDir[1] * Math.PI/180
            obj.innerRadius = radScale(obj.windSpd[0])
            obj.outerRadius = radScale(obj.windSpd[1])
            obj.fill = clrScale(obj.values)
        }
    }
    console.log(nestedData);

    // initialize the d3 arc maker
    var arc = d3.svg.arc() // notice that we do not assign attributes (such as startAngle) here. These will be inherited from data objects
    
    ctrdGrp.append("g")
        .selectAll("g")
            .data(nestedData)
            .enter().append("g")
                //.attr("something", function(d1) { return d1.key; }) // if we wanted to act on data on the first level of the nest, this is how
                .selectAll("path")
                    .data(function(d1){return d1.values;})
                    .enter().append("path")
                        .attr("d", arc) // map our data to the arc maker created above
                        .attr("fill", function(d) { return d.fill;})
                        

    // draw dots
    ctrdGrp.append("g").selectAll(".dot")
        .data(dObj.ticks)
        .enter().append("circle")
            .attr({
                class: "dot",
                r: 0.5,
                cx: function(d) { return( radMap(d)*Math.cos(angMap(d))); }  ,
                cy: function(d) { return( radMap(d)*Math.sin(angMap(d))); }  
            })         
    
    
    radialGrid(board.g, radius, ctrOffset, radScale, 5) 
    
}


function radialGrid(parentGroup, radius, ctrOffset, radScale, textPadding) {
    // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the parent
    // also, since (in this case) we want a WindDir value of 0 to indicated North (which should be up), we can rotate this group such that the x-axis is pointing up. Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
    var ctrdGrp = parentGroup.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ") rotate(-90)");
    
    var radTickCount = 4;
    
    var radAxisGroups = ctrdGrp.append("g") // radAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to a value along the radial axis
        .attr("class", "radius axis dashed")
      .selectAll("g")
        .data(radScale.ticks(radTickCount)) // bind a rough number of values of the radScale to this group, slicing the first one off to avoid having a value at the center
      .enter().append("g");

    radAxisGroups.append("circle") // append a circle to each
        .attr("r", radScale);
        
    radAxisGroups.append("line") // append a line to each 
        .attr({
            x1: radScale,
            y1: -textPadding*2,
            x2: radScale,
            y2: -radius,
        });       
       
        
    var angAxisGroups = ctrdGrp.append("g") // angAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to one of 12 values: angles between 0 and 360
        .attr("class", "angle axis dashed")
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
        .text(function(d) { return d > 270 ? null: d ; });        
        
    arcLikePath(ctrdGrp.append("g"), radius, 0, 1.5*Math.PI)
        .attr("class", "axis outer-arc");
        
        
    var radAxis = d3.svg.axis()
        .scale(radScale)
        .ticks(radTickCount)
        
    // draw rad axis
    ctrdGrp.append("g")
        .attr({
            class: "radius axis",
            transform: "translate(0,"+ -(radius+textPadding*3) +")" // move the whole axis to the left a bit
        })
        .call(radAxis)
        .selectAll("text")
            .attr({
                x: -10,
                y: 0,
                transform: "rotate(90) translate(0,"+(-textPadding)+")" // rotate text labels
            })
}



function arcLikePath(parentGroup, radius, startAngle, endAngle, resolution){
    if (typeof(resolution)==='undefined') resolution = (endAngle - startAngle)/(2*Math.PI) * 360; // one segment per angular degree
    // alter angles to behave like d3 arcs
    startAngle += Math.PI/2; 
    endAngle += Math.PI/2;
    
    var angle = d3.scale.linear()
        .domain([0, resolution-1])
        .range([startAngle, endAngle]);

    var line = d3.svg.line.radial()
        .interpolate("basis")
        .tension(0)
        .radius(radius)
        .angle(function(d, i) { return angle(i); });

    return parentGroup.append("path").datum(d3.range(resolution))
        .attr("d", line);
}


