

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 50;
        //tick.data.EPW.WindSpd = 10;
    }
    console.log(dObj);

    
    var textPadding = 5;
    var ctrOffset = 10;
    
    for (var d=0; d<364; d++){
        var startHour = d*24;
        var endHour = startHour + 23;
        var dayTicks = dObj.ticks.slice(startHour, endHour+1);
        console.log(dayTicks);
        
        // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
        // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
        board = dY.graph.addBoard("#dy-canvas",{inWidth: 80, inHeight:80, margin:20});
        
        // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
        // also, since in this case we want a WindDir value of 0 to indicated North (which should be up), we can rotate this group such that the x-axis is pointing up. Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
        var ctrdGrp = board.g.append("g")
            .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ") rotate(-90)");


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
            .data(dayTicks)
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
            .data(radScale.ticks(3)) // bind a rough number of values of the radScale to this group, slicing the first one off to avoid having a value at the center
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
            
            
    }
}

