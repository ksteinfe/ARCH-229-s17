var width = 100;
var height = 80;
var monthDict = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
};

var nMonth = 12,
    nDay = 31;
var colorDay = "#ecfcff",
    colorNight = "black";

var canvasWidth = width * (nMonth + 3),
    canvasHeight = height * (nDay + 3);

var outerRadius = height / 2.8;

// angles used to draw circular waves
var angles = d3.range(0, 2 * Math.PI, Math.PI / 25);

function onDataLoaded(data) {
    // console.log(data);
    var svg = d3.select("#dy-canvas").append("svg")
        .attr("height", canvasHeight)
        .attr("width", canvasWidth);
    var pieGroups = [];
    for (var k = 0; k < data.length; k++) {
        var x = width * (Math.floor(k / nDay) + 1.5);
        var y = height * (k % nDay + 1.5);
        var group = svg.append("g")
            .attr("transform", "translate(" + x + "," + y + ")")
            // rect = group.append("rect")
            // .attr("width", width)
            // .attr("height", height)
            // .style("visibility", "hidden")
            .on("mouseover", function() {
                var group = this;

                // // get center x, y coordinates
                // var x = d3.transform(group.getAttribute("transform")).translate[0],
                //     y = d3.transform(group.getAttribute("transform")).translate[1];
                // console.log(x + ";" + y);

                // draw circular wave here
                var startTime = new Date().getTime();
                var line = d3.svg.line.radial()
                    .angle(function(d) { return d; })
                    .radius(function(d, i) {
                        var t = new Date().getTime() / 1000;
                        return outerRadius + Math.cos(d * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(d - t)) / 2, 3) * 4;
                    });
                var path = d3.select(group)
                    .append("g")
                    .attr("id", "g-removable-path")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .attr("fill", "none")
                    .attr("stroke-width", 2)
                    .attr("stroke-linejoin", "round")
                    .append("path")
                    .datum(angles)
                    .attr("d", line)
                    .attr("stroke", "yellow");

                // run d3 timer to get time
                var t = d3.timer(function(elapsed) {
                    line.interpolate("basis-closed");
                    path.attr("d", line);
                    //if (elapsed > 60 * 1000) t.stop();
                }, 1);
            })
            .on("mousemove", function() {
                // var x = d3.mouse(this)[0],
                //     y = d3.mouse(this)[1];
                    // console.log("moving!" + x + " " +y);
            })
            .on("mouseout", function() {
                // remove path
                d3.selectAll("#g-removable-path").remove();
            });
        pieGroups.push(group);
    }
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
            innerArcs.append("path")
                .attr("fill", "white")
                .attr("fill-opacity", 0.1)
                .attr("d", innerArc).style("stroke", "white")
                .style("stroke-width", 2);

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


            // // add text at bottom of svg
            // pieGroups[index].selectAll("text")
            //     .data([dataByDay])
            //     .enter().append("text")
            //     .attr("x", function(d, i) {return (width - 12 * 6) / 3 * 2;})
            //     .attr("y", function(d, i) {return height * 0.95;})
            //     .attr("font-size", "12px")
            //     .attr("fill", "grey")
            //     .attr("font-family", "sans-serif")
            //     .text(function(d) {
            //         return monthDict["" + d.Month] + " " + d.Day;
            //     });

            // apply pattern
            // var pattern = pieGroups[index].append("defs")
            //     .append("pattern")
            //     .attr({ id:"hash4_4", width:"8", height:"8", patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)"})
            //     .append("rect")
            //     .attr({ width:"3", height:"8", transform:"translate(0,0)", fill:"#000000" });
        }
    }

    var fontFill = "#dcebee";
    // write month on top of svg
    var fontSize = 15;
    svg.selectAll("text-top")
        .data(getNArray(12))
        .enter().append("text")
        .attr("x", function(d, i) {
            return (i + 2.2) * width - fontSize * 2.2;
        })
        .attr("y", function(d, i) {
            return 1.1 * height;
        })
        .attr("fill", fontFill)
        .attr("font-family", "sans-serif")
        .text(function (d) {
            return monthDict["" + d];
        });


    // write day on left of svg
    svg.selectAll("text-left")
        .data(getNArray(31))
        .enter().append("text")
        .attr("x", function(d, i) {
            return 1.1 * width;
        })
        .attr("y", function(d, i) {
            return (i + 2.5) * height - fontSize * 2.5;
        })
        .attr("fill", fontFill)
        .attr("font-family", "sans-serif")
        .text(function (d) {
            return "" + d;
        });

    // write day on right of svg
    svg.selectAll("text-right")
        .data(getNArray(31))
        .enter().append("text")
        .attr("x", function(d, i) {
            return ( 1.8 + nMonth) * width;
        })
        .attr("y", function(d, i) {
            return (i + 2.5) * height - fontSize * 2.5;
        })
        .attr("fill", fontFill)
        .attr("font-family", "sans-serif")
        .text(function (d) {
            return "" + d;
        });
}

function convertTimeStringToMinutes(inputStr) {
    // "0740" --> 7 * 60 + 40
    var hr = parseInt(inputStr.substring(0, 2));
    var min = parseInt(inputStr.substring(2, 4));
    return hr * 60 + min;
}

function getNArray(num) {
    var array = [];
    for (var i = 0; i < num; i++) {
        array.push(i + 1);
    }
    return array;
}