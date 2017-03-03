

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    var outerRadius = 50;
    var innerRadius = 20;
    var margin = 10;
    var textPadding = 12;
    
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
      
    var moonLine = d3.svg.line.radial()
      //.interpolate("basis-closed")
      .radius(function(d){ return radScale(d.altitudeDeg); })
      .angle(function(d){ return angScale(d.hourOfDay); })
      
      
    
    for (var dayOfYear=27; dayOfYear<29; dayOfYear+=1){
        // calculate solar and lunar geometry for this day
        var sGeomAtDay = dY.solarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        var lGeomAtDay = dY.lunarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        
        // enrich solar and lunar data with hourOfDay
        sGeomAtDay.data.forEach(function(d,i){d.hourOfDay = i});
        lGeomAtDay.data.forEach(function(d,i){d.hourOfDay = i});

        // enrich lunar data with sunIsUp information
        lGeomAtDay.data.forEach(function(d,i){d.sunIsUp = sGeomAtDay.data[i].altitudeDeg > 0.0 });
        
        
        var moonData = lGeomAtDay.data;
        var modMoons = [];
        
        // we'll need the first hour of the next day to complete our line
        var firstMoonOfNextDay = dY.lunarGeom.hourlyAtGivenDay(dObj.location, dayOfYear+1).data[0];
        firstMoonOfNextDay.hourOfDay = 24;
        firstMoonOfNextDay.sunIsUp = false;
        moonData.push(firstMoonOfNextDay);
        
        var moonIsUpSwitch = lGeomAtDay.data[0].altitudeDeg >= 0.0; // set moonIsUpSwitch to condition at first hour
        var transIndices = [];
        for (var d in moonData){
            var moonIsUp = moonData[d].altitudeDeg > 0.0; // the 'up' condition for this moon
            if (moonIsUpSwitch != moonIsUp){ // if the condition for this moon is different than our switch
                var transHour = dY.util.remap( [moonData[d-1].altitudeDeg, moonData[d].altitudeDeg],[d-1,d],0.0); // find the hour of transit
                var transData = { // fake data with moon transit info
                        hourOfDay: transHour, 
                        altitudeDeg:0.0
                        }; 
                modMoons.push(transData); // add this fake moon to our array of modified moons
                transIndices.push(modMoons.length-1); // record the index of this transition
                moonIsUpSwitch = moonIsUp; // modify the switch to reflect the new condition
            }
            modMoons.push(moonData[d]); // add this moon to our array of modified moons
        }
        console.log(modMoons);
        console.log(transIndices);
        
        
        // slice off solar hours for which the sun is down
        sGeomAtDay.data = sGeomAtDay.data.slice(Math.ceil(sGeomAtDay.sunrise), Math.ceil(sGeomAtDay.sunset) );
       
        // add fake datas to solar data with sunrise and sunset information
        var riseData = {hourOfDay: sGeomAtDay.sunrise, altitudeDeg:0.0};
        var setData = {hourOfDay: sGeomAtDay.sunset, altitudeDeg:0.0};
        sGeomAtDay.data.unshift(riseData); // adds item to start of array
        sGeomAtDay.data.push(setData); // adds item to end of array              
        
        
        // sort lunar hours by those for which the moon is down
        // there may be one or two portions of the day that the moon is below the horizon
        upMoons = [];
        downMoons = [];
        var sIdx = 0;
        var idxs = transIndices.concat([modMoons.length-1]); // add the last index to our transitions array
        for (var i in idxs){
            var arr = modMoons.slice(sIdx,idxs[i]+1);
             if (arr[arr.length-2].altitudeDeg > 0.0) upMoons.push(arr); // does this work with short sections?
            else downMoons.push(arr);
            sIdx = idxs[i];
        }
        
        // sort lunar hours again for those for which the sun is down
        // there may be one or two portions of the day that the moon is below the horizon
        upMoonUpSuns = [];
        upMoonDownSuns = [];
        for (var u in upMoons){
            var upSuns = [];
            var downSuns = [];
            for (var m in upMoons[u]){
                var hr = upMoons[u][m].hourOfDay;
                if ( hr < sGeomAtDay.sunrise ) downSuns.push(upMoons[u][m]);
                if ( hr > sGeomAtDay.sunset ) downSuns.push(upMoons[u][m]);
                if ( (hr >= Math.floor(sGeomAtDay.sunrise) ) && (hr <= Math.ceil(sGeomAtDay.sunset) ) ) upSuns.push(upMoons[u][m]);
                //var hr = parseInt(upMoons[u][m].hourOfDay);  
                //if (upMoons[u][m].sunIsUp) upSuns.push(upMoons[u][m]);
                //else downSuns.push(upMoons[u][m]);
            }
            upMoonUpSuns.push(upSuns);
            upMoonDownSuns.push(downSuns);
        }
        
        console.log(upMoonUpSuns);
        console.log(upMoonDownSuns);
        console.log(downMoons);
        
        
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
            

        
        ctrdGrp.append('path')
            .datum(sGeomAtDay.data)
            .attr({
                d: area,
                class: "sun-fill"
            });    

        ctrdGrp.append('path')
            .datum(sGeomAtDay.data)
            .attr({
                d: inLine,
                class: "sun-inline"
            });               
            
        ctrdGrp.append('path')
            .datum(sGeomAtDay.data)
            .attr({
                d: outLine,
                class: "sun-outline"
            });
            
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
            .text( dateStr )
            .style("text-anchor", "middle")
            .attr({
                class: "day-label",
                x: outerRadius,
                y: 2*outerRadius  - textPadding
            });
        
        
        for (var m in upMoonUpSuns){
            ctrdGrp.append('path')
                .datum(upMoonUpSuns[m])
                .attr({
                    d: moonLine,
                    class: "upmoon-outline sunup"
                });
        }
        
        for (var m in upMoonDownSuns){
            ctrdGrp.append('path')
                .datum(upMoonDownSuns[m])
                .attr({
                    d: moonLine,
                    class: "upmoon-outline sundown"
                });
        }        
        
        for (var m in downMoons){
            ctrdGrp.append('path')
                .datum(downMoons[m])
                .attr({
                    d: moonLine,
                    class: "downmoon-outline"
                });
        }
        
    }
    
}

