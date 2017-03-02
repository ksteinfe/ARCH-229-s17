

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
    
    // I used this to manipulate the incoming data to test validity of graph
    for (var t in dObj.ticks) {
        tick = dObj.ticks[t];
        //tick.data.EPW.WindDir = 50;
        //tick.data.EPW.WindSpd = 10;
    }
    console.log(dObj);

    
    var outerRadius = 50;
    var innerRadius = 1;
    var margin = 10;
    var textPadding = 12;
    var ctrOffset = 40;
    

    /**
    // Setup Angular Axis
    // Wind direction is recorded in degrees east of north, with zero degrees indicating wind from the north, and 90 degrees indicating wind from the east.    
    var angScale = d3.scale.linear() // value -> display
        .domain([0,24])
        .range([0, Math.PI*2]); // an angle of 0 should be pointing up toward the top of the canvas.          
    */
    var angValue = function (d) { return d.valueOf("WindDir"); }; // data -> value
    var angScale = d3.scale.linear() // value -> display
        .domain([0, 360])
        .range([0, 2 * Math.PI]);
    var angMap = function (d) { return angScale(angValue(d)); }; // value -> display  


    /**
    // Setup Radial Axis
    // 
    var radScale = d3.scale.linear()  // value -> display
        .domain([0,90])
        .range([innerRadius,outerRadius]);   
    */
    var radValue = function (d) { return d.valueOf("WindSpd"); }; // data -> value
    var radScale = d3.scale.linear()  // value -> display
        .domain(dObj.metaOf("WindSpd").domain) 
        .range([innerRadius, outerRadius]);
    var radMap = function (d) { return radScale(radValue(d)); }; // data -> display
    

    // Setup Lines
    //
    var outLine = d3.svg.line.radial()
      .radius(function (d) { return radMap(d); })
      .angle(function (d) { return angMap(d); })
      
    var inLine = d3.svg.line.radial()
      .radius(radScale(0))
      .angle(function(d, i){ return angScale(d.hourOfDay); })      
      
   /** var area = d3.svg.area.radial()
      .innerRadius(radScale(0))
      .outerRadius(function(d){ return radScale(d.altitudeDeg); })
      .angle(function(d, i){ return angScale(d.hourOfDay); })
      */

    
    for (var dayOfYear=0; dayOfYear<365; dayOfYear+=1){
        // calculate solar geometry for this day
        var geomAtDay = dY.solarGeom.hourlyAtGivenDay(dObj.location, dayOfYear);
        // enrich data with hourOfDay
        geomAtDay.data.forEach(function(d,i){d.hourOfDay = i});
        // slice off hours for which the sun is down
        geomAtDay.data = geomAtDay.data.slice(Math.ceil(geomAtDay.sunrise), Math.ceil(geomAtDay.sunset) );
       
        
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
            
    
       /** // a new data set with fake data points for sunrise and sunset
        var riseData = {hourOfDay: geomAtDay.sunrise,altitudeDeg:0.0};
        var setData = {hourOfDay: geomAtDay.sunset, altitudeDeg:0.0};
        geomAtDay.data.unshift(riseData); // adds item to start of array
        geomAtDay.data.push(setData); // adds item to end of array
     */

       /** ctrdGrp.append('path')
            .datum(geomAtDay.data)
            .attr({
                d: area,
                class: "sun-fill"
            });    
            */

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
            
        /**var dotRad = 2.0;
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
            */
            
        var dateStr = (dY.datetime.hourOfYearToDate(geomAtDay.dayOfYear*24).getUTCMonth()+1) + " / " + dY.datetime.hourOfYearToDate(geomAtDay.dayOfYear*24).getUTCDate() 
        board.g.append("text")
            .text( dateStr )
            .style("text-anchor", "middle")
            .attr({
                class: "day-label",
                x: outerRadius,
                y: 2*outerRadius  - textPadding
            });
                    
        
    }
    
}

