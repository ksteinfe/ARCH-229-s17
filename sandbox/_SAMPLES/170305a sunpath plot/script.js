

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 50;
        //tick.data.EPW.WindSpd = 10;
    }
    //console.log(dObj);
        
    // A function we'll need
    var splitAtDiscontinuousHours = function(arr, key){
        var bins = [];
        var bin = [arr[0]];
        var idx = arr[0][key];
        for (var n=1; n<arr.length; n++){
            if (arr[n][key] != idx+1){
                bin.domain = [bin[0][key], bin[bin.length-1][key] ];
                bins.push(bin);
                bin = [arr[n]];
            } else { 
                bin.push(arr[n]);
            }
            idx = arr[n][key];
        }
        bin.domain = [bin[0][key], bin[bin.length-1][key] ];
        bins.push(bin);
        return bins;
    } 
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    var margin = 50;
    var radius = 150
    var board = dY.graph.addBoard("#dy-canvas",{inWidth: radius*2*2+margin, inHeight:radius*2, margin:margin});
    
    
    // since it's more convienent to plot with (0,0) at the center of our radial plot, let's create a SVG group with the origin translated to the center of the board
    var ctrdGrpWS = board.g.append("g")
        .attr("transform", "translate(" + radius + "," + radius + ") ");
    
    var ctrdGrpSF = board.g.append("g")
        .attr("transform", "translate(" + (radius*3 + margin) + "," + radius + ") ");
    
    
    
    
    // Setup Scales and Maps to nest data and do a solar plot
    
    // Setup Angular Axis
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.    
    var angValue = function(d) { return d.azimuthDeg; }; // data -> value
    var angScale = d3.scale.linear() // value -> display
        .domain([0,360])
        .range([0, 2*Math.PI]); // an angle of 0 should be pointing up toward the top of the canvas.
    var angMap = function(d) { return angScale(angValue(d));}; // data -> display    
        
    // Setup Radial Axis
    // 
    var radValue = function(d) { return d.altitudeDeg; }; // data -> value
    var radScale = d3.scale.linear()  // value -> display
        //.domain(dObj.metaOf("WindSpd").domain)
        .domain([90,0])
        .range([0,radius]);
    var radMap = function(d) { return radScale(radValue(d));}; // data -> display        
    
    
    
    var analemmaData = [];
    for (var h=0; h<24; h++) analemmaData.push( dY.solarGeom.dailyAtGivenHour(dObj.location, h) );
    
    var analemmaLine = d3.svg.line.radial()
        .radius(function(d) { return radMap(d); })
        .angle(function(d) { return angMap(d); });
        
    var anaGrpFrontWinterSpring =  ctrdGrpWS.append("g").attr("class", "analemma front");
    var anaGrpBackWinterSpring =  ctrdGrpWS.append("g").attr("class", "analemma back");
    var anaGrpFrontSummerFall =  ctrdGrpSF.append("g").attr("class", "analemma front");
    var anaGrpBackSummerFall =  ctrdGrpSF.append("g").attr("class", "analemma back");    
    
    for (var ana in analemmaData){
        var filteredForSunup = analemmaData[ana].data.filter(function(d){ return d.altitudeDeg > 0; });
        //console.log(filteredForSunup);
        
        var filteredForWinterSpring = filteredForSunup.filter(function(d){ 
            var season = dY.timeSpan.dayOfYear( d.dayOfYear ).season();
            return season.idx == 0 || season.idx == 1;
        });
        var filteredForSummerFall = filteredForSunup.filter(function(d){ 
            var season = dY.timeSpan.dayOfYear( d.dayOfYear ).season();
            return season.idx == 2 || season.idx == 3;
        });
        
        if (filteredForWinterSpring.length >0){
            var grouped = splitAtDiscontinuousHours(filteredForWinterSpring, "dayOfYear");
            for (var g in grouped){
                anaGrpFrontWinterSpring.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
                anaGrpBackSummerFall.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);                    
            }
        }
        if (filteredForSummerFall.length >0){
            var grouped = splitAtDiscontinuousHours(filteredForSummerFall, "dayOfYear");
            for (var g in grouped){
                anaGrpBackWinterSpring.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);
                anaGrpFrontSummerFall.append("path")
                    .datum(grouped[g])
                    .attr("d", analemmaLine);                    
            }
        }    
         
         
    }
    
    
    var axisWS = ctrdGrpWS.append("g").attr("class", "axis")
    axisWS.append("circle")
        .attr({
            r: radius
        });
        
    var axisSF = ctrdGrpSF.append("g").attr("class", "axis")
    axisSF.append("circle")
        .attr({
            r: radius
        });
}


