

function onDataLoaded(dObj) {

    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);

    // // dummy values to check for negative (it works)
    // for (var t in dObj.ticks) {
    //   tick = dObj.ticks[t];
    //   tick.data.EPW.DryBulbTemp = -10;
    // }


    dObj.ticks = dObj.ticks.slice(0,24);


    //need hourly summaries!
    //comfortable dry bulb inbetween 68,75
    //how to apply function to ticks?



    var barPadding = 1;  // space between the bars

    //probably shouldnt do but for 12 boards.
    //then find a way to change slice indexes for whatever data.
    for (var i =0; i< 12; i++) {



    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).
    board = dY.graph.addBoard("#dy-canvas",{inWidth:300, inHeight: 250 ,margin:40});
    console.log(board);

    // We define yValue as a function that, given a data item, returns the proper value for this axis
    var yValue = function(d) { return d.valueOf("DryBulbTemp"); }; // data -> value

    // We define yScale as a D3 scale function that, given a value in one domain (the domain of values taken from our data), returns a coordinate on the canvas (a location within the drawing dimensions of our board).
    // Recall that x-coordinates move from left to right and y-coordinates move from top to bottom.
    var yScale = d3.scale.linear()  // value -> display
        .domain([0,24])
        .range((board.dDims.yRange));

    var xScale = d3.scale.linear()
        .domain([0,20])
        .range((board.dDims.xRange));

    // So scle will visually show -20 to 20
    var xScale2 = d3.scale.linear()
        .domain([-20,20])
        .range((board.dDims.xRange));



    // We define yMap as a combonation of the two functions defined above.
    // A function that, given a data item, returns a coordinate on the canvas
    var yMap = function(d) { return yScale(yValue(d));}; // data -> display
    var xMap = function(d) { return xScale(yValue(d));}; // data -> display

    // D3 will draw an axis to the canvas for us - ticks, labels and all!
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(24)
        // .tickValues([0,0,30])
        .orient("left");


    var xAxis = d3.svg.axis()
        .scale(xScale2)
        .ticks(289/12)
        .orient("bottom");



    // draw the y-axis
    board.g.append("g") // appends a new group to the board
        .attr({
            class: "y axis",
            transform: "translate(-10,0)" // moves this group a bit to the left
        })
        .call(yAxis);

    //draw the x-axis
    board.g.append("g") // appends a new group to the board
        .attr({
            class: "x axis",
            transform: "translate(0,252)" // moves this group a bit down
            })
            .call(xAxis);

    // draw the bars
    board.g.selectAll("rect")
        .data(dObj.ticks)
        .enter()
        .append("rect")
        .attr({
            class: "bar",
            x: function(d) { if(d.valueOf("DryBulbTemp") < 0) { return (board.dDims.width / 2) - Math.abs((xMap(d)/2));}
            else return (board.dDims.width / 2);},
            y: function(d, i) { return i * (board.dDims.height / dObj.ticks.length); },
            height: '.75'*(board.dDims.width / dObj.ticks.length - barPadding),
            width: function(d) { return Math.abs((xMap(d)/2));}
          })
        .style({
            "opacity": function(d) {if(d.mean <0) {return '.25';}
            else return '.75'; },
            "fill": "tomato",
          })
        //Hovering Effects
        .on("mouseout", function(d,i) {
            d3.select(this).transition()
            .style("fill", "gray");})
        .on("mouseover", function(d,i) {
            d3.select(this).transition()
            .style("fill", "tomato");
          });

        // For side numbers

         board.g.selectAll("text")
            .data(dObj.ticks)
            .text(function(d) {
                 return d.valueOf("DryBulbTemp") + " C";
            })
            .attr("class", "anno")
            .attr("x", 320)
            .attr("y", function(d, i) { return (board.dDims.height / dObj.ticks.length) - 5;})
            .attr("font-family", "sans-serif")
            .attr("font-size", "8px")
            .attr("fill", "red")
            // .on("mouseout", function(d,i) {
            //     d3.select(this).transition()
            //     .ease("elasticout")
            //     .delay("100")
            //     .duration("200")
            //     .attr("x", "320");})
            .on("mouseover", function(d,i) {
                d3.select(this).transition()
                .ease("elasticout")
                .delay("100")
                .duration("200")
                .attr("x", 320/2 - 5);});





      //opening fade
      d3.selectAll("rect").transition().delay(1000).style("fill", "gray");
    }



}
