

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    //Width and height of the SVG
    var w = 600;
    var h = 450;
    var padding = 30;
    var barPadding = 1;  // space between the bars
    var cy_jitter = 20;
    var miniyWidth = 20;
    var r = 2; // radius of circles
    var occ_str = 8;
    var occ_end = 18;
    //Define zone numbers
    var cz = {
        "CZ01RV2": 1,
        "CZ02RV2": 2,
        "CZ03RV2": 3,
        "CZ04RV2": 4,
        "CZ05RV2": 5,
        "CZ06RV2": 6,
        "CZ07RV2": 7,
        "CZ08RV2": 8,
        "CZ09RV2": 9,
        "CZ10RV2": 10,
        "CZ11RV2": 11,
        "CZ12RV2": 12,
        "CZ13RV2": 13,
        "CZ14RV2": 14,
        "CZ15RV2": 15,
        "CZ16RV2": 16
    };
    
    var czs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    /*
    //Create SVG element
    var svg = d3.select("#dy-canvas")
        .append("svg")
        .attr("class", "board") // the board class is defined in the standard CSS file for the class, and should be applied to all SVGs we place in the canvas
        .attr("width", w)
        .attr("height", h);
    */
    board = dY.graph.addBoard("#dy-canvas",{inWidth:w, inHeight:h,margin:padding});
    console.log(board); 
    
    //Create scale functions
    var xScale = d3.scale.linear()
                         .domain([0, 25])
                         .range((board.dDims.xRange));
                         
    var yScale = d3.scale.linear()
                         .domain([16, 0])
                         .range((board.dDims.yRange));
     
    var miniyScale = d3.scale.linear()
                             .domain([23, 0])
                             .range([-miniyWidth/2, miniyWidth/2])
                         
    //Define X axis
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(5);
    
    //Define Y axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(10);
    
    //Create X axis
    board.g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis);
    /*
    //Create Y axis
    board.g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (0) + ")")
        .call(yAxis);
        */
    
    //Create gridlines
    board.g.selectAll("rect")
         .data(czs)
         .enter()
         .append("rect")
         .attr({
            x: xScale(0),
            y: function(d, i) { return yScale(i+1) + miniyScale(occ_end); },
            width: xScale(25),
            height: miniyScale(occ_str) - miniyScale(occ_end),
            fill: "#e6e6e6"
         });
    
    
    //Create circles
    board.g.selectAll("circle")
       .data(dObj)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
            return xScale(d["ChW Supply"]);
       })
       .attr("cy", function(d) {
            return yScale(cz[d["Design Day"]]) + miniyScale(d["Start Time"]);
       })
       .attr("r", r)
       .attr("fill", function(d) {
            if (d["Operation Hours"] >= 3 && d["Operation Hours"] < 10) {
                return "#fee8c8";
            } else if (d["Operation Hours"] >= 11 && d["Operation Hours"] < 17) {
                return "#fdbb84";
            } else {
                return "#e34a33";
            }
       });

}

