

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

    
    for (var dayOfYear=0; dayOfYear<365; dayOfYear+=1){
        // calculate solar geometry for this day
        var geomAtDay = dY.solarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        // enrich data with hourOfDay
        geomAtDay.data.forEach(function(d,i){d.hourOfDay = i});
        // slice off hours for which the sun is down
        geomAtDay.data = geomAtDay.data.slice(Math.ceil(geomAtDay.sunrise), Math.ceil(geomAtDay.sunset) );
       
        
        console.log(geomAtDay);
        
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
            
            
        // a new data set with fake data points for sunrise and sunset
        var riseData = {hourOfDay: geomAtDay.sunrise,altitudeDeg:0.0};
        var setData = {hourOfDay: geomAtDay.sunset, altitudeDeg:0.0};
        geomAtDay.data.unshift(riseData); // adds item to start of array
        geomAtDay.data.push(setData); // adds item to end of array
        
        ctrdGrp.append('path')
            .datum(geomAtDay.data)
            .attr({
                d: area,
                class: "sun-fill"
            });    

        ctrdGrp.append('path')
            .datum(geomAtDay.data)
            .attr({
                d: inLine,
                class: "sun-inline"
            });               
            
        ctrdGrp.append('path')
            .datum(geomAtDay.data)
            .attr({
                d: outLine,
                class: "sun-outline"
            });
            
        var dotRad = 2.0;
        ctrdGrp.append("circle")
            .attr({
                r: dotRad,
                cx: innerRadius,
                transform: "rotate(-90) rotate("+ (angScale(geomAtDay.sunset) * (180/Math.PI)) +")"
            });
            
        ctrdGrp.append("circle")
            .attr({
                r: dotRad,
                cx: innerRadius,
                transform: "rotate(-90) rotate("+ (angScale(geomAtDay.sunrise) * (180/Math.PI)) +")"
            });
            
        var dateStr = (dY.datetime.hourOfYearToDate(geomAtDay.dayOfYear*24).getUTCMonth()+1) + " / " + dY.datetime.hourOfYearToDate(geomAtDay.dayOfYear*24).getUTCDate() 
        board.g.append("text")
            .text( dateStr )
            .style("text-anchor", "middle")
            .attr({
                class: "day-label",
                x: outerRadius,
                y: 2*outerRadius  - textPadding
            });
            
/*            
cx: function(d) { return( radScale(0)*Math.cos(angScale(geomAtDay.sunrise)) - Math.PI); }  ,
cy: function(d) { return( radScale(0)*Math.sin(angScale(geomAtDay.sunrise)) - Math.PI); }  
   */         
        
    }
    
}

