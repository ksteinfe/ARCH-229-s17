var width = 1000 / 5;
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

var nMonth = 12;
var nDay = 31;
var colorDay = "#e6b800";
var colorNight = "url(#hash4_4)";

var nPerRow = 16;
var canvasWidth = width * (nPerRow + 1);
var canvasHeight = Math.floor(nMonth * ( nDay + 2 ) / nPerRow * height);

d3.csv("sunrise_sunset.csv", function(error, data) {
    var svg = d3.select("body").append("svg")
        .attr("height", canvasHeight)
        .attr("width", canvasWidth);
    var pieGroups = [];
    for (var k = 0; k < data.length; k++) {
        var row = Math.floor(k / nPerRow);
        var col = k % nPerRow;
        var x = width * (col + 1 / 2);
        var y = height * (row + 1 / 2);
        var group = svg.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");
            //.attr("style", "outline: thin dashed grey;");
        pieGroups.push(group);
    }
    var outerRadius = height / 3;
    var innerRadius = 0;
    var pie = d3.layout.pie()
        .sort(null);  // null as do not sort input data

    var innerArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(outerRadius / 3 * 2);
    var outerArc = d3.svg.arc()
        .innerRadius(outerRadius / 3 * 2)
        .outerRadius(outerRadius);

    for (var i = 0; i < nMonth; i++) {
        for (var j = 0; j < nDay; j++) {
            var index = i * nDay + j;
            var dataByDay = data[index];  // JSON object of data by day
            // skip days with no data
            if (dataByDay.Rise === "" || dataByDay.Set === "") {
                continue;
            }
            // console.log({
            //     'month': dataByDay.Month,
            //     'day': dataByDay.Day,
            //     'Rise': dataByDay.Rise,
            //     'Set': dataByDay.Set
            // });
            var timeTillRise = convertTimeStringToMinutes(dataByDay.Rise);
            var timeTillSet = convertTimeStringToMinutes(dataByDay.Set);

            // draw inner Arc
            var innerArcs = pieGroups[index].selectAll(".arc_inner")
                .data(pie([timeTillRise, 12 * 60 - timeTillRise]))
                .enter().append("g")
                .attr("class", "arc_inner")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            innerArcs.append("path")
                .attr("fill", function(d, i) {
                    // console.log(d, i);
                    if (i === 0) {
                        return colorNight;
                    }
                    return colorDay;
                })
                .attr("d", innerArc);

            // draw outer Arc
            var outerArcs = pieGroups[index].selectAll(".arc_outer")
                .data(pie([timeTillSet - 12 * 60, 24 * 60 - timeTillSet]))
                .enter().append("g")
                .attr("class", "arc_outer")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            outerArcs.append("path")
                .attr("fill", function(d, i) {
                    // console.log(d, i);
                    if (i === 0) {
                        return colorDay;
                    }
                    return colorNight;
                })
                .attr("d", outerArc);


            // add text at bottom of svg
            pieGroups[index].selectAll("text")
                .data([dataByDay])
                .enter().append("text")
                .attr("x", function(d, i) {return (width - 12 * 6) / 3 * 2;})
                .attr("y", function(d, i) {return height * 0.95;})
                .attr("font-size", "12px")
                .attr("fill", "grey")
                .attr("font-family", "sans-serif")
                .text(function(d) {
                    return monthDict["" + d.Month] + " " + d.Day;
                });

            // apply pattern
            var pattern = pieGroups[index].append("defs")
                .append("pattern")
                .attr({ id:"hash4_4", width:"8", height:"8", patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)"})
                .append("rect")
                .attr({ width:"3", height:"8", transform:"translate(0,0)", fill:"#b3ccff" });
        }
    }
});

function convertTimeStringToMinutes(inputStr) {
    // "0740" --> 7 * 60 + 40
    var hr = parseInt(inputStr.substring(0, 2));
    var min = parseInt(inputStr.substring(2, 4));
    return hr * 60 + min;
}