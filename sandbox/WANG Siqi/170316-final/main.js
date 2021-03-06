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

// angles used to draw circular waves
var angles = d3.range(0, 2 * Math.PI, Math.PI / 25);

// for zooming in/out
var zoom = d3.behavior.zoom()
    .on("zoom", zoomed);

var canvasWidth, canvasHeight;
var width, height;
var displayStyle;

var outerRadius;
var innerArc, outerArc;

var svg, g, view;

// cache loaded data and re-load on resizing
var cachedData;

// dynamic resizing (responsive)
window.addEventListener("resize", function () {
    onDataLoaded(cachedData);  // redraw
});

function initDynamicParameters() {
    // fit canvas to device size
    var edgeLength;
    if (window.innerWidth / window.innerHeight < 4 / 3) {
        // for narrow display set style to 31(day) * 12(month)
        displayStyle = "narrow";
        width = window.innerWidth / (nMonth + 3);  // can use 100 as absolute
        edgeLength = width;

        canvasWidth = window.innerWidth;
        canvasHeight = Math.floor(edgeLength * (nDay + 3));
    } else {
        // for wide display set style to 12 * 31
        displayStyle = "wide";
        height = window.innerHeight / (nMonth + 3);  // can use 100 as absolute
        edgeLength = height;

        canvasHeight = window.innerHeight;
        canvasWidth = Math.floor(edgeLength * (nDay + 3));
    }
    // use same value for both width and height
    width = edgeLength;
    height = edgeLength;

    outerRadius = edgeLength / 2.8;

    // basic element on drawing arcs
    innerArc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(outerRadius / 3 * 2);
    outerArc = d3.svg.arc()
        .innerRadius(outerRadius / 3 * 2)
        .outerRadius(outerRadius);

    // remove any existing svgs
    d3.select("#dy-canvas")
        .selectAll("svg")
        .remove();
    svg = d3.select("#dy-canvas")
        .on("touchstart", nozoom)
        .on("touchmove", nozoom)
        .append("svg")
        .attr("height", canvasHeight)
        .attr("width", canvasWidth);

    g = svg.append("g").call(zoom);

    g.append("rect")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)
        .attr("fill", "grey");

    view = g.append("g");
}

function onDataLoaded(data) {
    if (data === undefined) {
        return;
    }
    initDynamicParameters();

    // console.log(data);
    cachedData = data;
    var pieGroups = [];
    for (var k = 0; k < data.length; k++) {
        var coords = calculateCoordsForPieGraph(k);
        var x = coords.x,
            y = coords.y;
        var group = view.append("g")
            .attr("transform", "translate(" + x + "," + y + ")")
            .on("mouseover", onMouseOver)
            .on("mousemove", onMouseMove)
            .on("mouseout", onMouseOut)
            .on("click", onMouseClick);
        pieGroups.push(group);
    }
    var pie = d3.layout.pie()
        .sort(null);  // null as do not sort input data

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
                .attr("fill", function (d, i) {
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
                .attr("fill", function (d, i) {
                    // console.log(d, i);
                    if (i === 0) {
                        return colorDay;
                    }
                    return colorNight;
                })
                .attr("d", outerArc);


            // add text of sunrise sunset time
            pieGroups[index].selectAll("text")
                .data([dataByDay])
                .enter().append("text")
                .attr("x", function(d, i) {return width / 3.5;})
                .attr("y", function(d, i) {return height / 2;})
                .attr("font-size", "" + width / 30)
                .attr("fill", "none")
                .attr("font-family", "sans-serif")
                .text(function(d) {
                    return "" + d.Rise.substring(0, 2) + ":" + d.Rise.substring(2, 4) +
                        "-" + d.Set.substring(0, 2) + ":" + d.Set.substring(2, 4);
                });

            // apply pattern
            // var pattern = pieGroups[index].append("defs")
            //     .append("pattern")
            //     .attr({ id:"hash4_4", width:"8", height:"8", patternUnits:"userSpaceOnUse", patternTransform:"rotate(45)"})
            //     .append("rect")
            //     .attr({ width:"3", height:"8", transform:"translate(0,0)", fill:"#000000" });
        }
    }

    // draw scales
    drawScales();
}

function convertTimeStringToMinutes(inputStr) {
    // "0740" --> 7 * 60 + 40
    var hr = parseInt(inputStr.substring(0, 2));
    var min = parseInt(inputStr.substring(2, 4));
    return hr * 60 + min;
}

function calculateCoordsForPieGraph(dataIndex) {
    var x, y;
    if (displayStyle === "narrow") {
        x = width * (Math.floor(dataIndex / nDay) + 1.5);
        y = height * (Math.floor(dataIndex % nDay) + 1.5);
    } else {
        // "wide" scenario
        x = width * (Math.floor(dataIndex % nDay) + 1.5);
        y = height * (Math.floor(dataIndex / nDay) + 1.5);
    }
    return {x: x, y: y};
}

function getNArray(num) {
    var array = [];
    for (var i = 0; i < num; i++) {
        array.push(i + 1);
    }
    return array;
}

function drawScales() {
    var fontFill = "#dcebee";
    var fontSize = 15;

    if (displayStyle === "narrow") {
        // write month on top of svg
        view.selectAll("text-top")
            .data(getNArray(nMonth))
            .enter().append("text")
            .attr("x", function (d, i) {
                return (i + 2.2) * width - fontSize * 2.2;
            })
            .attr("y", function (d, i) {
                return 1.1 * height;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return monthDict["" + d];
            });

        // write day on left of svg
        view.selectAll("text-left")
            .data(getNArray(nDay))
            .enter().append("text")
            .attr("x", function (d, i) {
                return 1.1 * width;
            })
            .attr("y", function (d, i) {
                return (i + 2.5) * height - fontSize * 2.5;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return "" + d;
            });

        // write day on right of svg
        view.selectAll("text-right")
            .data(getNArray(nDay))
            .enter().append("text")
            .attr("x", function (d, i) {
                return (1.8 + nMonth) * width;
            })
            .attr("y", function (d, i) {
                return (i + 2.5) * height - fontSize * 2.5;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return "" + d;
            });
    } else {
        // "wide" scenario
        // write day on top of svg
        view.selectAll("text-top")
            .data(getNArray(nDay))
            .enter().append("text")
            .attr("x", function (d, i) {
                return (i + 2.2) * width - fontSize * 2.2;
            })
            .attr("y", function (d, i) {
                return 1.1 * height;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return "" + d;
            });


        // write month on left of svg
        view.selectAll("text-left")
            .data(getNArray(nMonth))
            .enter().append("text")
            .attr("x", function (d, i) {
                return 1.1 * width;
            })
            .attr("y", function (d, i) {
                return (i + 2.5) * height - fontSize * 2.5;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return monthDict["" + d];
            });

        // write month on right of svg
        view.selectAll("text-right")
            .data(getNArray(nMonth))
            .enter().append("text")
            .attr("x", function (d, i) {
                return (2 + nDay) * width;
            })
            .attr("y", function (d, i) {
                return (i + 2.5) * height - fontSize * 2.5;
            })
            .attr("fill", fontFill)
            .attr("font-family", "sans-serif")
            .text(function (d) {
                return monthDict["" + d];
            });
    }
}

// handle zoom actions
function zoomed() {
    view.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

function nozoom() {
    d3.event.preventDefault();
}

// handle mouse click event binded on arcs
function onMouseClick(d, i) {
    this.parentNode.appendChild(this);
    var x = d3.transform(this.getAttribute("transform")).translate[0],
        y = d3.transform(this.getAttribute("transform")).translate[1];
    d3.select(this)
        .on("click", null) // disable click event when in transition
        .transition()
        .attr("transform", "translate(" + (x - 2 * width) + "," + (y - 2 * height) + ")" + "scale(" + 5 + ")")
        .each(function() {
            d3.select(this)
                .selectAll("text")
                .attr("fill", "black");
        });

    d3.select(this)
        .transition()
        .delay(1000)
        .attr("transform", "translate(" + x + "," + y + ")" + "scale(" + 1 + ")")
        .each("end", function () {
            d3.select(this).on("click", onMouseClick);  // re-enable click action after transition
            // set text to be visible
            d3.select(this)
                .selectAll("text")
                .attr("fill", "none");
        });
}

// handle mouse over event
function onMouseOver() {
    var group = this;

    // // get center x, y coordinates
    // var x = d3.transform(group.getAttribute("transform")).translate[0],
    //     y = d3.transform(group.getAttribute("transform")).translate[1];
    // console.log(x + ";" + y);

    // draw circular wave here
    var startTime = new Date().getTime();
    var line = d3.svg.line.radial()
        .angle(function (d) {
            return d;
        })
        .radius(function (d, i) {
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
    var t = d3.timer(function (elapsed) {
        line.interpolate("basis-closed");
        path.attr("d", line);
        //if (elapsed > 60 * 1000) t.stop();
    }, 1);
}

// handle mouse out event
function onMouseOut() {
    // remove path
    d3.selectAll("#g-removable-path").remove();
}

// handle mouse move event
function onMouseMove() {
    // var x = d3.mouse(this)[0],
    //     y = d3.mouse(this)[1];
    // console.log("moving!" + x + " " +y);
}
