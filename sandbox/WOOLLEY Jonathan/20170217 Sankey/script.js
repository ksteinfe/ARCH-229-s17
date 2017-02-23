

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    


    var formatNumber = d3.format(",.0f");
    var format = function(d) { return formatNumber(d) + " TWh"; };
    
        // add another board (an SVG) to the canvas.
    var board = dY.graph.addBoard("#dy-canvas",{inWidth: 800, inHeight:600, margin:20});

    // Setup Color
    //
    var cValue = function(d) { return d.category};
    var cScale = d3.scale.ordinal()
        .domain(["foo", "bar", "baz", "qux"])
        .range(colorbrewer.RdGy[4]); // see http://colorbrewer2.org/#type=diverging&scheme=RdGy&n=10 
    var cMap = function(d) { return cScale(cValue(d));}; // data -> display        
    
    
    var sankey = d3.sankey()
        .nodeWidth(10)
        .nodePadding(8)
        .size(board.dDims.range);

    var path = sankey.link();


    sankey
        .nodes(dObj.nodes)
        .links(dObj.links)
        .layout(32);

    var link = board.g.append("g").selectAll(".link")
        .data(dObj.links)
    .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    var node = board.g.append("g").selectAll(".node")
        .data(dObj.nodes)
    .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", function() { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

    node.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { return cMap(d); })
        .style("stroke", function(d) { return d3.rgb(cMap(d)).darker(2); })
    .append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });

    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < board.dDims.width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    function dragmove(d) {
        d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(board.dDims.height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }



}

