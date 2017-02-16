var width = 1000 / 4;
var height = 500 / 3;
var monthDict = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "July",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
};

var svgs = [];
for (var i = 0; i < 12; i++) {
    var svg = d3.select("body")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .attr("style", "outline: thin dashed grey;");
    svgs.push(svg);
}

d3.csv("some_data.csv", function(error, data) {
    var scale = width / 6 / 500;
    data.forEach(function(value, i) {
        svgs[i].selectAll("circle")
            .data([value.directRad, value.diffuseRad, value.skyCover])
            .enter().append("circle")
            .attr("cx", function(d, i) {
                return ( i + 1 ) * width / 4;
            })
            .style("fill", function (d, i) {
                var color;
                if ( i===0 ) {
                    color = "orange";
                } else if ( i===1 ) {
                    color = "cyan";
                } else {
                    color = "grey";
                }
                return color;
            })
            .attr("cy", height / 2)
            .attr("r", function (d, i) {
                return d * scale;
            });
        svgs[i].selectAll("text")
            .data([value.month])
            .enter().append("text")
            .attr("x", function(d, i) {return width / 2;})
            .attr("y", function(d, i) {return height * 0.9;})
            .attr("font-size", "20px")
            .attr("font-family", "sans-serif")
            .text(function(d) {
                return monthDict["" + d];
            });
    })
});

// var dataArray = [2, 13, 15, 20, 24, 12, 17];
// var svg = d3.select("body").append("svg").attr("height", "200").attr("width", "100%");
// var endX = [0];
// svg.selectAll("circle")
//     .data(dataArray)
//     .enter().append("circle")
//     .attr("cx", function(d, i) {
//         endX[0] += (d *4) + (30);
//         return endX[0];
//     })
//     .attr("cy", "150")
//     .attr("r", function(d, i) {return d * 2;})
//
// var dataArrayV2 = [19, 3, 7, 20, 20, 12, 17];
// var svgV2 = d3.select("body").append("svg").attr("height", "200").attr("width", "100%");
// var endXV2 = [0];
// svgV2.selectAll("circle")
//     .data(dataArrayV2)
//     .enter().append("circle")
//     .attr("cx", function(d, i) {
//         endXV2[0] += (d *4) + (40);
//         return endXV2[0];
//     })
//     .attr("cy", "150")
//     .attr("r", function(d, i) {return d * 2;})
//
//
// var dataArrayV3 = [12, 13, 15, 20, 12, 12, 17];
// var svgV3 = d3.select("body").append("svg").attr("height", "200").attr("width", "100%");
// var endXV3 = [0];
// svgV3.selectAll("circle")
//     .data(dataArrayV3)
//     .enter().append("circle")
//     .attr("cx", function(d, i) {
//         endXV3[0] += (d *4) + (30);
//         return endXV3[0];
//     })
//     .attr("cy", "150")
//     .attr("r", function(d, i) {return d * 2;})
