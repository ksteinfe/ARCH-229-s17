




function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 180;
        //tick.data.EPW.WindSpd = 30;
    }
    //console.log(dObj);

    
        // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
        // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
        board = dY.graph.addBoard("#dy-canvas", { inWidth: 800, inHeight: 5900, margin: 20 });
      
        var textPadding = 2;
        var ctrOffset = 0;
        var colsPerRow = 7;

        for (var d = 0; d < 365; d++) {
            var startHour = d * 24;
            var endHour = startHour + 23;
            var dayTicks = dObj.ticks.slice(startHour, endHour + 1);
            console.log(dayTicks);

            //data nesting!!
            var qDirStep = 10
            var qDirScale = d3.scale.quantize()
               .domain([0, 360])
               .range(d3.range(0, 360, qDirStep));

            var nestedData = d3.nest()
               .key(function (d) { return qDirScale(d.valueOf("WindDir")); })
               .rollup(function (leaves) {
                   return d3.sum(leaves, function (d) {
                       return d.valueOf("WindSpd");
                   });
               })
               .entries(dayTicks);

            //console.log(nestedData);


            // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
            // also, since in this case we want a WindDir value of 0 to indicated North (which should be up), we can rotate this group such that the x-axis is pointing up. Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
            var width = 100;
            var height = 100;
            var padding = 10;
            var x = (d%colsPerRow) * (width+padding);
            var y =  Math.floor(d/colsPerRow) * (height+padding);
            var ctrdGrp = board.g.append("g")
                .attr("transform", "translate("+x+","+y+") translate(" + width / 2 + "," + height / 2 + ") rotate(-90)");
           
          



            // setup radius
            var radius = width / 3
            var radValue = function (d) { return d.valueOf("WindSpd"); }; // data -> value
            var radScale = d3.scale.linear()  // value -> display
                //.domain(dObj.metaOf("WindSpd").domain)
                .domain([0,40])
                .range([ctrOffset, radius]);
            var radMap = function (d) { return radScale(radValue(d)); }; // data -> display

            // setup angle
            // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.
            var angValue = function (d) { return d.valueOf("WindDir"); }; // data -> value
            var angScale = d3.scale.linear() // value -> display
                .domain([0, 360])
                .range([0, 2 * Math.PI]);
            var angMap = function (d) { return angScale(angValue(d)); }; // data -> display

            // draw dots
            ctrdGrp.append("g").selectAll(".dot")
                .data(dayTicks)
                .enter().append("circle")
                    .attr({
                        class: "dot",
                        r: 0.4,
                        fill:"grey",
                        cx: function (d) { return (radMap(d) * Math.cos(angMap(d))); },
                        cy: function (d) { return (radMap(d) * Math.sin(angMap(d))); }
                    })

            // draw more dots
            ctrdGrp.append("g").selectAll(".dot")
                .data(nestedData)
                .enter().append("circle")
                    .attr({
                        class: "reddot",
                        r: 0.2,
                        fill: "red",
                        stroke: "grey",
                        strokewidth: ".2",
                        cx: function (d) { return (radMap(d.values) * Math.cos(angMap(d.key))); },
                        cy: function (d) { return (radMap(d.values) * Math.sin(angMap(d.key))); }
                    })

            //try to add line


            //add fake starting and ending data
            var startdata = { values: 0, key: 0 };
            var enddata = { values: 0, key: 0 };
            nestedData.unshift(startdata);
            nestedData.push(enddata);

            //console.log(nestedData);

          

            // connect dots and draw polyline 

            var lineData = nestedData;

            var lineFunction = d3.svg.line()
                               .x(function (d) { return (radMap(d.values) * Math.cos(angMap(d.key))); })
                               .y(function (d) { return (radMap(d.values) * Math.sin(angMap(d.key))); })
                               .interpolate("linear");
                         
//radial gradient for the path
            var defs = svg.append("defs");
          
            
            var gradient = defs.append("radialGradient")
   .attr("id", "svgGradient")
   .attr("x0", "0%")
   .attr("x2", "100%")
   .attr("y0", "0%")
   .attr("y2", "100%");
            gradient.append("stop")
               .attr('class', 'start')
               .attr("offset", "0%")
               .attr("stop-color", "#000000")
               .attr("stop-opacity", .8);
            gradient.append("stop")
               .attr('class', 'end')
               .attr("offset", "100%")
               .attr("stop-color", "#000005")
               .attr("stop-opacity", .6);

            var stargraph = ctrdGrp.append("path")
                                       .attr("d", lineFunction(lineData))
                                       .attr("fill", "url(#svgGradient)")
                                       .on("mouseover", function (d) { d3.select(this).style("fill", "red"); })
                                       .on("mouseout", function (d) { d3.select(this).style("fill", "url(#svgGradient)");})
             
            ;



            


            //draw coordinate


            var radAxisGroups = ctrdGrp.append("g") // radAxisGroups is a reference to a collection of subgroups within this group. each subgroup has data bound to it related to a value along the radial axis
                .attr("class", "radius axis")
              .selectAll("g")
                .data(radScale.ticks(3)) // bind a rough number of values of the radScale to this group, slicing the first one off to avoid having a value at the center
              .enter().append("g");

            radAxisGroups.append("circle") // append a circle to each
                .attr("r", radScale);

            
            var disp = 10 + height/2;
            radAxisGroups.append("line") // append a line to each 
                .attr("x2", -disp)
                .attr("y1", radScale)
                .attr("y2", radScale);

            radAxisGroups.append("text") // append some text to each
                .attr("x", function (d) { return radScale(d); }) // d in this case is a tick value along the radScale axis
                .text(function (d) { return d; })
                .attr("transform", "rotate(90) translate(0, " + disp + ")") // rotate to horizontal, translate to bottom of board
                .style("text-anchor", "middle");



            //draw date
            var dateStr = (dY.dt.hourOfYearToDate(d*24).getUTCMonth()+1) + " / " + dY.dt.hourOfYearToDate(d*24).getUTCDate();
            ctrdGrp.append("text")
                .text( dateStr )
                .style("text-anchor", "middle")
                .attr("transform", "rotate(90) translate(0, " + (disp) + ")") // rotate to horizontal, translate to bottom of board 
                .attr("class", "daylabel");
            
            
        }
    }