

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    //Width and height of the SVG
    var w = 600;
    var h = 450;
    var padding = 30;
    
    var color = "steelblue";
    
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5
    var values = d3.range(1000).map(d3.random.normal(20, 5));
    
    var arr = [];
    for (i = 0; i < dObj.length; i++){
        if (dObj[i]["ChW Supply"] >= 0) {
            arr.push(dObj[i]["ChW Supply"]);
        }
    }
    
    values = arr;
    
    board = dY.graph.addBoard("#dy-canvas",{inWidth:w, inHeight:h,margin:padding});
    console.log(board);

    var max = d3.max(values);
    var min = d3.min(values);
    
    var x = d3.scale.linear()
          .domain([min, max])
          .range((board.dDims.xRange));

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
                 .bins(x.ticks(20))
                 (values);
   
    
    
    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    
    var colorScale = d3.scale.linear()
                             .domain([yMin, yMax])
                             .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
              .domain([yMax, 0])
              .range((board.dDims.yRange));

    var xAxis = d3.svg.axis()
                      .scale(x)
                      .orient("bottom");

    var bar = board.g.selectAll(".bar")
                   .data(data)
                   .enter().append("g")
                   .attr("class", "bar")
                   .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return h - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    board.g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);
    /*
        
    board = dY.graph.addBoard("#dy-canvas",{inWidth:w, inHeight:h,margin:padding});
    console.log(board);
    
    var arr = [];
    for (i = 0; i < dObj.length; i++){
        arr.push(dObj[i]["ChW Supply"]);
    }
    
     */
}

