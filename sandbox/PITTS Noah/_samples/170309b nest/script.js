

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 45;
        //tick.data.EPW.WindSpd = 10;
    }
    
    console.log(dObj);
    
    var qDirStep = 30
    var qDirScale = d3.scale.quantize()
        .domain([0,360])
        .range(d3.range(0, 360, qDirStep));
        
    var qSpdStep = 5
    var qSpdScale = d3.scale.quantize()
        .domain([0,20])
        .range(d3.range(0, 20, qSpdStep));
        
    var nestedData = d3.nest()
        .key(function(d) { return qDirScale(d.valueOf("WindDir")); })
        .key(function(d) { return qSpdScale(d.valueOf("WindSpd")); })
        .rollup(function(d) { return d.length; })
        .entries(dObj.ticks);
    
    var log = d3.select("#dy-head")
        .selectAll("div")
            .data(nestedData)
            .enter().append("div")
                .html(function(d1,i){return (i)+". dir: "+d1.key+" sum count: "+d3.sum(d1.values, function(d2){ return d2.values;}) ;})
                .style("background-color","lightgray")
                .selectAll("div")
                    .data(function(d1){return d1.values;})
                    .enter().append("div")
                        .html(function(d2){return "spd: "+d2.key+", count:"+d2.values;})
                        .style("background-color","white");
    
      
}

