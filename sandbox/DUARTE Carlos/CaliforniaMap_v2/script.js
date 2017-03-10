

function onDataLoaded(dObj, map) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    console.log(map);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth:960, inHeight:600, margin:40});
    console.log(board);
    
    // define variables used later
    var w = board.dDims.width,
        h = board.dDims.height;
    
    var mini_w = 425,
        mini_h = 250,
        mini_w_origin = 500
        mini_h_origin = 0;
    
    var mini_scatter_plot_w = 20;
    
    dot_sz = 2;
    
    var percentile = 100; // pecentile to get chilled water data and create color on cities
    
    var map_scale = 3000;
    map = topojson.simplify(topojson.presimplify(map));                 // simplify topojson
    map = topojson.quantize(map, 1e9);                                  // reduce size of topology
    var climates = topojson.feature(map, map.objects.climates);
    
    //zone numbers
    var cz_rev = [
        {"Zone": 1, "name": "CZ01RV2", "city": "Arcata", "coordinates": [-124.0828, 40.8665], "population": 17697},
        {"Zone": 2, "name": "CZ02RV2", "city": "Santa Rosa", "coordinates": [-122.7141, 38.4404], "population": 171990},
        {"Zone": 3, "name": "CZ03RV2", "city": "Oakland", "coordinates": [-122.2711, 37.8044], "population": 406253},
        {"Zone": 4, "name": "CZ04RV2", "city": "San Jose", "coordinates": [-121.8863, 37.3382], "population": 998537},
        {"Zone": 5, "name": "CZ05RV2", "city": "Santa Maria", "coordinates": [-120.4357, 34.9530], "population": 102216},
        {"Zone": 6, "name": "CZ06RV2", "city": "Torrance", "coordinates": [-118.3406, 33.8358], "population": 147478},
        {"Zone": 7, "name": "CZ07RV2", "city": "San Diego", "coordinates": [-117.1611, 32.7157], "population": 1356000},
        {"Zone": 8, "name": "CZ08RV2", "city": "Fullerton", "coordinates": [-117.9243, 33.8704], "population": 138981},
        {"Zone": 9, "name": "CZ09RV2", "city": "Burbank", "coordinates": [-118.3090, 34.1808], "population": 104709},
        {"Zone": 10, "name": "CZ10RV2", "city": "Riverside", "coordinates": [-117.3962, 33.9533], "population": 316619},
        {"Zone": 11, "name": "CZ11RV2", "city": "Red Bluff", "coordinates": [-122.2358, 40.1785], "population": 14104},
        {"Zone": 12, "name": "CZ12RV2", "city": "Sacramento", "coordinates": [-121.4944, 38.5816], "population": 479686},
        {"Zone": 13, "name": "CZ13RV2", "city": "Fresno", "coordinates": [-119.7726, 36.7468], "population": 509924},
        {"Zone": 14, "name": "CZ14RV2", "city": "Palmdale", "coordinates": [-118.1165, 34.5794], "population": 157161},
        {"Zone": 15, "name": "CZ15RV2", "city": "Palm Spring", "coordinates": [-116.5453, 33.8303], "population": 46281},
        {"Zone": 16, "name": "CZ16RV2", "city": "Blue Canyon", "coordinates": [-120.7110, 39.2571], "population": 2005}
    ];
    
    // define projection of map
    var projection = d3.geo.albers()
                       .parallels([34, 40.5])
                       .center([0, 37.7750])
                       .rotate([120, 0])
                       .scale(map_scale)
                       .translate([200, h/2 - 75]);
    
    var path = d3.geo.path()
                 .projection(projection);
    
    var data_by_climate = d3.nest().key(function(d) {return d["Design Day"]; }).entries(dObj)
    var chw_points = d3.values(dObj).map(function(d) { return d["ChW Supply"]; });
    var population = d3.values(cz_rev).map(function(d) { return d["population"]; });
    
    var chw_max = d3.max(chw_points);
    var chw_min = d3.min(chw_points);
    
    var color_chw = d3.scale.linear()
                      .domain([26, 10])
                      .range(["#31a354","#e5f5e0"]) //"#e5f5f9",
    
    var select_chw_color = function(d) {
             var climate_data = data_by_climate[(d.Zone) - 1];
             var dat_chw = d3.values(climate_data.values).map(function(d) { return d["ChW Supply"]; });
             var filter_chw = dat_chw.filter(function(d){return d > 0; })
             var city_color = color_chw(d3.quantile(filter_chw.sort(function(a, b){ return a - b; }), percentile));

             return city_color
        };
    
    // scale for radius size
    var scale_pop = d3.scale.linear()
                      .domain([d3.min(population), d3.max(population)])
                      .range([3, 10]);
                      
    var miniyScale = d3.scale.linear()
                         .domain([23, 0])
                         .range([-mini_scatter_plot_w/2, mini_scatter_plot_w/2])
                 
                 
    // drawing map polygons
    board.g.append("g")
        .attr("class", "climate zones")
        .selectAll("path")
        .data(climates.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
             //var filter_data = data_by_climate[(d.Zone) - 1];
             //var filter_chw = d3.values(filter_data.values).map(function(d) { return d["ChW Supply"]; });
             return '#ffdb99'//color_chw(d3.median(filter_chw)) ;
        });
        
    
    // draw climate boundaries lines
    board.g.append("path")
        .datum(topojson.mesh(map, map.objects.climates, function(a,b){ return a !== b; }))
        .attr("class", "climate-boundaries")
        .attr("d", path);
    
    
    // draw climates cities
    var city = board.g.selectAll("g.city")
           .data(cz_rev)
           .enter().append("g")
           .attr("class", "city")
           .attr("transform", function(d) {
               return "translate(" + projection([ d.coordinates[0], d.coordinates[1] ]) + ")"; 
                                })
    
    
    city.append("circle")
        .attr("r", function(d) { 
                    return scale_pop(d.population) } )
        .style("fill", select_chw_color)
        .style("opacity", 0.75)
        .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0] + w/2;
            var yPosition = d3.mouse(this)[1] + h/2;
            
            var filter_data = data_by_climate[(d.Zone) - 1];
            var filter_chw = d3.values(filter_data.values).map(function(d) { return d["ChW Supply"]; });
            
            var values = filter_chw.filter(function(d){return d > 0; });
            var max = d3.max(values);
            var min = d3.min(values);
            
            var xScale = d3.scale.linear()
                                 .domain([0, 25])
                                 .range([mini_w_origin, mini_w_origin+mini_w]);
            
            //Define X axis
            var xAxis = d3.svg.axis()
                          .scale(xScale)
                          .orient("bottom")
                          .ticks(7);
            
            
            // Generate a histogram using twenty uniformly-spaced bins.
            var hist_data = d3.layout.histogram()
                                     .bins(xScale.ticks(20))
                                     (values);
            
            var yMax = d3.max(hist_data, function(d){return d.length});
            var yMin = d3.min(hist_data, function(d){return d.length});
            
            var color = color_chw(d3.quantile(values.sort(function(a, b){ return a - b; }), percentile));
            var colorScale = d3.scale.linear()
                                     .domain([yMin, yMax])
                                     .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

            var yScale = d3.scale.linear()
                                 .domain([0, yMax])
                                 .range([mini_h+mini_h_origin, mini_h_origin]);

            var bar = board.g.selectAll("g.bar")
                           .data(hist_data)
                           .enter().append("g")
                           .attr("class", "bar")
                           .attr("id", "tooltip")
                           .attr("transform", function(d) { 
                                                    return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; 
                                                    });
                           
                           
            bar.append("rect")
                .attr("width", (xScale(hist_data[0].dx) - xScale(0)) - 1)
                .attr("height", function(d) { 
                                        return mini_h + mini_h_origin - yScale(d.y); 
                                        })
                .attr("fill", color);
            
            
            //Create circles
            board.g.selectAll("g.scatter")
               .data(filter_data.values)
               .enter()
               .append("circle")
               .attr("id", "tooltip")
               .attr("cx", function(d) {
                    return xScale(d["ChW Supply"]);
               })
               .attr("cy", function(d) {
                    return yScale(0) + 50 + miniyScale(d["Start Time"]);
               })
               .attr("r", dot_sz)
               .attr("fill", function(d) {
                    if (d["Operation Hours"] >= 3 && d["Operation Hours"] < 10) {
                        return "#fee8c8";
                    } else if (d["Operation Hours"] >= 11 && d["Operation Hours"] < 17) {
                        return "#fdbb84";
                    } else {
                        return "#e34a33";
                    }
               });
            
            //Create X axis
            board.g.append("g")
                    .attr("class", "axis")
                    .attr("id", "tooltip")
                    .attr("transform", "translate(0," + (mini_h+mini_h_origin) + ")")
                    .call(xAxis);
                    
            
            // Display city name by histogram
            var txt_size = 30;
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", mini_w_origin)
                   .attr("y", mini_h_origin)
                   .attr("font-size", txt_size + "px")
                   .attr("fill", "black")
                   .text(d.city);
                   
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", mini_w_origin)
                   .attr("y", mini_h_origin + txt_size)
                   .attr("font-size", txt_size-5 + "px")
                   .attr("fill", "black")
                   .text("Climate zone " + d.Zone);

            d3.select(this)
              .attr("r", 50)

        })
        .on("mouseout", function(d) {
            d3.selectAll("#tooltip")
              .transition()
              .duration(250)
              .remove();
            
            d3.select(this)
              .transition()
              .duration(250)
              .style("fill", select_chw_color)
              .attr("r", function(d){
                    return scale_pop(d.population)
              });
        });
     
    // draw city names by location
    city.append("text")
        .attr("x", 5)
        .attr("font-size", "20px")
        .text(function(d){ return d.city; })  
}
