

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    var outerRadius = 50;
    var innerRadius = 20;
    var margin = 10;
    var textPadding = 12;
    
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
    
    
    // Setup Angular Axis
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.    
    var angScale = d3.scale.linear() // value -> display
        .domain([0,24])
        .range([0, Math.PI*2]); // an angle of 0 should be pointing up toward the top of the canvas.          
    
    // Setup Radial Axis
    // 
    var radScale = d3.scale.linear()  // value -> display
        .domain([0,90])
        .range([innerRadius,outerRadius]);   
    
    
    // Setup Lines
    //
    var outLine = d3.svg.line.radial()
      .radius(function(d){ return radScale(d.altitudeDeg); })
      .angle(function(d, i){ return angScale(d.hourOfDay); })
      
    var inLine = d3.svg.line.radial()
      .radius(radScale(0))
      .angle(function(d, i){ return angScale(d.hourOfDay); })      
      
    var area = d3.svg.area.radial()
      .innerRadius(radScale(0))
      .outerRadius(function(d){ return radScale(d.altitudeDeg); })
      .angle(function(d, i){ return angScale(d.hourOfDay); })
     
      
    
    for (var dayOfYear=0; dayOfYear<364; dayOfYear+=1){
        console.log(dayOfYear)
        // calculate solar and lunar geometry for this day
        var sGeomAtDay = dY.solarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        var lGeomAtDay = dY.lunarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        
        // enrich solar and lunar data with hourOfDay, isUp, and sunIsUp
        sGeomAtDay.data.forEach(function(d,i){
            d.hourOfDay = i;
            d.isUp = d.altitudeDeg > 0.0;
        });
        lGeomAtDay.data.forEach(function(d,i){
            d.hourOfDay = i;
            d.isUp = d.altitudeDeg > 0.0;
            d.sunIsUp = sGeomAtDay.data[i].altitudeDeg > 0.0;
        });
        
        // moon altitudeDeg at sunrise and sunset
        var riseHrs = [Math.floor(sGeomAtDay.sunrise),Math.ceil(sGeomAtDay.sunrise)]; 
        var setHrs = [Math.floor(sGeomAtDay.sunset),Math.ceil(sGeomAtDay.sunset)]; 
        var moonAltAtSunrise = dY.util.remap( riseHrs, [lGeomAtDay.data[riseHrs[0]].altitudeDeg, lGeomAtDay.data[riseHrs[1]].altitudeDeg], sGeomAtDay.sunrise); 
        var moonAltAtSunset = dY.util.remap( setHrs, [lGeomAtDay.data[setHrs[0]].altitudeDeg, lGeomAtDay.data[setHrs[1]].altitudeDeg], sGeomAtDay.sunset);         
                
        // slice off solar hours for which the sun is down
        sGeomAtDay.data = sGeomAtDay.data.slice(Math.ceil(sGeomAtDay.sunrise), Math.ceil(sGeomAtDay.sunset) );
        
        // add fake datas to solar data with sunrise and sunset information
        var riseData = {hourOfDay: sGeomAtDay.sunrise, altitudeDeg:0.0};
        var setData = {hourOfDay: sGeomAtDay.sunset, altitudeDeg:0.0};
        sGeomAtDay.data.unshift(riseData); // adds item to start of array
        sGeomAtDay.data.push(setData); // adds item to end of array
        
        
         // we'll need the first hour of the next day to complete our moon line
        var firstMoonOfNextDay = dY.lunarGeom.hourlyAtGivenDay(dObj.location, dayOfYear+1).data[0];
        firstMoonOfNextDay.hourOfDay = 24;
        firstMoonOfNextDay.sunIsUp = false;
        firstMoonOfNextDay.isUp = firstMoonOfNextDay.altitudeDeg > 0.0;;
        lGeomAtDay.data.push(firstMoonOfNextDay);
        
        
        var nestedMoons = d3.nest()
            .key(function(d) { return d.isUp; })
            .sortKeys(d3.ascending)
            .map(lGeomAtDay.data);
        //console.log(nestedMoons)
        
        var moonDns = splitAtDiscontinuousHours( nestedMoons[false] , "hourOfDay" );
        //console.log(moonDns);
        
        var moonUps = d3.nest()
            .key(function(d) { return d.sunIsUp; })
            .sortKeys(d3.ascending)
            .map(nestedMoons[true]);
            
        var moonUpSunUps = false;
        if (moonUps.hasOwnProperty(true) ) {
            moonUpSunUps = splitAtDiscontinuousHours( moonUps[true] , "hourOfDay" );  // grab all up moons for which the sun is up, and split at discontinuous hours
            for (var m in moonUpSunUps){
                // add in fake sunrise and sunset hour
                if (moonUpSunUps[m][0].hourOfDay == riseHrs[1])  moonUpSunUps[m].unshift({hourOfDay: sGeomAtDay.sunrise, altitudeDeg:moonAltAtSunrise}); 
                if (moonUpSunUps[m][moonUpSunUps[m].length-1].hourOfDay == setHrs[0] ) moonUpSunUps[m].push({hourOfDay: sGeomAtDay.sunset, altitudeDeg:moonAltAtSunset});                
            }            
        }
        console.log(moonUpSunUps);
        
        var moonUpSunDns = false;
        if (moonUps.hasOwnProperty(false) ) {
            moonUpSunDns = splitAtDiscontinuousHours( moonUps[false] , "hourOfDay" );  // grab all up moons for which the sun is down, and split at discontinuous hours
            for (var m in moonUpSunDns){
                // add in fake sunrise and sunset hour
                if (moonUpSunDns[m][0].hourOfDay == setHrs[1])  moonUpSunDns[m].unshift({hourOfDay: sGeomAtDay.sunset, altitudeDeg:moonAltAtSunset}); 
                if (moonUpSunDns[m][moonUpSunDns[m].length-1].hourOfDay == riseHrs[0] ) moonUpSunDns[m].push({hourOfDay: sGeomAtDay.sunrise, altitudeDeg:moonAltAtSunrise}); 
            }
        }
        //console.log(moonUpSunDns)
        
        
        
        
        
        // add another board (an SVG) to the canvas.
        var board = dY.graph.addBoard("#dy-canvas",{inWidth: outerRadius*2, inHeight: outerRadius*2, margin:margin});
        var ctrdGrp = board.g.append("g")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ") rotate(180)");
            
        var radAxisGroups = ctrdGrp.append("g")
            .attr("class", "radius axis dashed");
            
        radAxisGroups.append("circle")
            .attr("r", outerRadius);
            
        radAxisGroups.append("circle")
            .attr("r", innerRadius);
                   
            
        radAxisGroups.append("line")
            .attr({
                x1: innerRadius,
                x2: outerRadius
            });           
            
        radAxisGroups.append("line")
            .attr({
                x1: -innerRadius,
                x2: -outerRadius
            });   
            
        ctrdGrp.append("g")
            .attr("class", "sun-fill")
            .append("path")
                .datum(sGeomAtDay.data)
                .attr("d", area);
        
        ctrdGrp.append("g")
            .attr("class", "moon-fill")
            .selectAll("path")
                .data(moonUpSunDns)
                .enter().append("path")
                    .attr("d", area);                
                
        ctrdGrp.append("g")
            .attr("class", "sunup-inline")
            .append("path")
                .datum(sGeomAtDay.data)
                .attr("d", inLine);
                
        
        
        ctrdGrp.append("g")
            .attr("class", "downline")
            .selectAll("path")
                .data(moonDns)
                .enter().append("path")
                    .attr("d", outLine);
        
        
        ctrdGrp.append("g")
            .attr("class", "moonup-outline")
            .selectAll("path")
                .data(moonUpSunDns)
                .enter().append("path")
                    .attr("d", outLine);
                    
        ctrdGrp.append("g")
            .attr("class", "moonup-inline")
            .selectAll("path")
                .data(moonUpSunDns)
                .enter().append("path")
                    .attr("d", inLine);
        
        if (moonUpSunUps){
            ctrdGrp.append("g")
                .attr("class", "downline")
                .selectAll("path")
                    .data(moonUpSunUps)
                    .enter().append("path")
                        .attr("d", outLine);  
        } 

        ctrdGrp.append("g")
            .attr("class", "sunup-outline")
            .append("path")
                .datum(sGeomAtDay.data)
                .attr("d", outLine);     
        
        
        var dotRad = 2.0;
        ctrdGrp.append("circle")
            .attr({
                r: dotRad,
                cx: innerRadius,
                transform: "rotate(-90) rotate("+ (angScale(sGeomAtDay.sunset) * (180/Math.PI)) +")"
            });
            
        ctrdGrp.append("circle")
            .attr({
                r: dotRad,
                cx: innerRadius,
                transform: "rotate(-90) rotate("+ (angScale(sGeomAtDay.sunrise) * (180/Math.PI)) +")"
            });

        

        
      


        
        var dateStr = (dY.dt.hourOfYearToDate(sGeomAtDay.dayOfYear*24).getUTCMonth()+1) + " / " + dY.dt.hourOfYearToDate(sGeomAtDay.dayOfYear*24).getUTCDate() 
        board.g.append("text")
            .text( dayOfYear )
            .style("text-anchor", "middle")
            .attr({
                class: "day-label",
                x: textPadding/3,
                y: 2*outerRadius+textPadding/2
            });
        
        
    }
    
}

