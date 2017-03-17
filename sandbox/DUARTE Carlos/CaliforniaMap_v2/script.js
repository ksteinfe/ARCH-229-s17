

function onDataLoaded(dObj, map, weather) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    console.log(map);
    console.log(weather);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth:960, inHeight:550, margin:40});
    console.log(board);
    
    // define variables used later
    var w = board.dDims.width,
        h = board.dDims.height;
    
    // parameters for side plot
    var mini_w = 425,
        mini_h = 250,
        mini_w_origin = 500
        mini_h_origin = 0;
    
    var mini_scatter_plot_w = 20;
    var dot_sz = 2;
    
    // start and end of occupied period
    var str_occ = 8,
        end_occ = 18;
    
    var ct_approach = 0;
    
    var percentile = 1.0;           // percentile to get chilled water data and create color on cities
    var weather_percentile = .99    // percentile to get weather data
    
    var map_scale = 3000;
    map = topojson.simplify(topojson.presimplify(map));                 // simplify topojson
    map = topojson.quantize(map, 1e9);                                  // reduce size of topology
    var climates = topojson.feature(map, map.objects.climates);
    
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
    
    // orange color scale, the redder the higher the temp
    var color_chw = d3.scale.linear()
                      .domain([12, 24])
                      .range(["#3182bd", "#9ecae1"]) //"#e5f5f9",
    
    var color_wea = d3.scale.linear()
                      .domain([15, 29])
                      .range(["#e3b594", "#cb7537"])
    
    var color_oper = d3.scale.threshold()
                       .domain([10, 18, 24])
                       .range(['#f0f0f0','#bdbdbd','#636363'])
    
    var select_chw_color = function(d) {
            var dbcIndex = -1;
            for (var dbc in data_by_climate){
                if (d.name == data_by_climate[dbc].key) {
                    dbcIndex = dbc;
                    break;
                }
            }
             var climate_data = data_by_climate[dbcIndex];
             var dat_chw = d3.values(climate_data.values).map(function(d) { return d["ChW Supply"]; });
             var filter_chw = dat_chw.filter(function(d){return d > 0; })
             var city_color = color_chw(d3.quantile(filter_chw.sort(function(a, b){ return a - b; }), percentile));

             return city_color
        };
    
    // Process weather data
    var weather_by_climate = d3.nest().key(function(d) {return d["name"]; })
                                      .key(function(d) {return d["Months"]; })
                                      .entries(weather)
    
    
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
            var sub_weather = cz[+d.properties.Zone];
            var w = weather.filter(function(d) {return d.name == sub_weather && 
                                                (d.Months >= 5 && d.Months <= 10) &&
                                                (d.Hours <= str_occ || d.Hours >= end_occ); });
            var twb = d3.values(w).map(function(d) { return d["WetBulbT"]; })
                                  .sort(function(a,b) { return a-b; });

            var color = color_wea(d3.quantile(twb, weather_percentile));
            console.log(sub_weather + " Twb= " + d3.quantile(twb, weather_percentile))
            return color;
        })
        .on("click", function(d) {
            d3.selectAll("g.city").selectAll("circle")
              .transition()
              .duration(100)
              .attr("r", 50)
        });
        
    
    // draw climate boundaries lines
    board.g.append("path")
        .datum(topojson.mesh(map, map.objects.climates, function(a,b){ return a !== b; }))
        .attr("class", "climate-boundaries")
        .attr("d", path);
    
    // get each individual string of numbers and pair them up
    var point_path_element_array = function(d) {
            var points_array = d.slice(1, d.length).split(',');
            var pairs_array = [];
            
            for(var i = 0; i < points_array.length; i += 2){
                pairs_array.push([+points_array[i], +points_array[i+1]]);
            };
            return pairs_array;
    };
    
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
        .style("opacity", 0.95)
        .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0] + w/2;
            var yPosition = d3.mouse(this)[1] + h/2;
            
            var dbcIndex = -1;
            for (var dbc in data_by_climate){
                if (d.name == data_by_climate[dbc].key) {
                    dbcIndex = dbc;
                    break;
                }
            }
            
            // filter chilled water data
            var filter_data = data_by_climate[dbcIndex];
            var filter_chw = d3.values(filter_data.values)
                               .map(function(d) { return [d["ChW Supply"], d["Operation Hours"]]; })
                               .filter(function(d){return d[0] > 0; });
            
            var chw_values = filter_chw.map(function(d) {return d[0]; });
            
            // filter weather data
            sub_weather = d.name;
            var w = weather.filter(function(g) {return g.name == sub_weather && 
                                    (g.Months >= 5 && g.Months <= 10) &&
                                    (g.Hours <= str_occ || g.Hours >= end_occ); });
            
            var wea_max = d3.max(d3.values(w).map(function(d) { return d["WetBulbT"]; }));
            var wea_min = d3.min(d3.values(w).map(function(d) { return d["WetBulbT"]; }));
            
            // subset simulations by matching weather to chw temperature
            var chw_2_wea = filter_chw.filter(function(d) {return d[0] > (wea_min + ct_approach) && d[0] < (wea_max + ct_approach); });
            var oper_metric = d3.median(chw_2_wea.map(function(d) {return d[1]; }));
            
            if (oper_metric > str_occ) {
                var str_wea_frame = str_occ;
                var end_wea_frame = 24 - (oper_metric - str_occ);
            } else {
                var str_wea_frame = oper_metric;
                var end_wea_frame = str_occ;
            };
            
            var w_best = weather.filter(function(g) {return g.name == sub_weather && 
                                    (g.Months >= 5 && g.Months <= 10) &&
                                    (g.Hours <= str_wea_frame || g.Hours > end_wea_frame); });
            
            w_best_twb = w_best.map(function(d){return d["WetBulbT"]; })
                               .sort(function(a, b){ return a - b; });
            
            var xScale = d3.scale.linear()
                                 .domain([0, 25])
                                 .range([mini_w_origin, mini_w_origin+mini_w]);
            
            
            // Generate a histogram using twenty uniformly-spaced bins.
            var hist_data = d3.layout.histogram()
                                     .bins(xScale.ticks(20))
                                     (chw_values);
            
            
            // decide potential to get rid of chiller
            var twb_percentiles = [.75, .50, .25, .10];
            var i = 0;
            var potential = -1;
            while (potential <= .75 && i < twb_percentiles.length) {
                var twbp = twb_percentiles[i];
                var twb_at_percentile = d3.quantile(w_best_twb, twbp);
                var potential_sims = d3.sum(hist_data.filter(function(d) {return d.x > twb_at_percentile; })
                                                     .map(function(d){ return d.y; }));
                                                     
                var tlt_sims = filter_chw.length
                var potential = potential_sims/tlt_sims;
                i ++;
            }
            
            var text_potential = d3.scale.threshold()
                                   .domain([.10, .5, .75, 1.01])
                                   .range([ 'None', 'Low','Medium','High']);
                                   
            var color_potential = d3.scale.linear()
                                    .domain([.75, 1.00]);
            
            if (text_potential(twbp) == 'High') {
                color_potential.range(['#e5f5e0', '#31a354']);
                
            } else if (text_potential(twbp) == 'Medium') {
                color_potential.range(['#fdb95b', '#bc6f02']);
                
            } else if (text_potential(twbp) == 'Low') {
                color_potential.range(['#fc9272', '#fa5827']);
                
            } else {
                color_potential.range(['#de2d26', '#9f1d18']);
            }
            
            var color = color_chw(d3.quantile(chw_values.sort(function(a, b){ return a - b; }), percentile));
            console.log("Chw= " + d3.quantile(chw_values.sort(function(a, b){ return a - b; }), percentile))
            
            var yScale = d3.scale.linear()
                                 .domain([0, .5])
                                 .range([mini_h+mini_h_origin, mini_h_origin]);
            
            //Define X axis
            var xAxis = d3.svg.axis()
                          .scale(xScale)
                          .orient("bottom")
                          .ticks(7);
                          
            //Define Y axis
            var yAxis = d3.svg.axis()
                          .scale(yScale)
                          .orient("right")
                          .ticks(4);
            
            var bar = board.g.selectAll("g.bar")
                           .data(hist_data)
                           .enter().append("g")
                           .attr("class", "bar")
                           .attr("id", "tooltip")
                           .attr("transform", function(d) { 
                                                    return "translate(" + xScale(d.x) + "," + yScale(d.y/tlt_sims) + ")"; 
                                                    });
                           
                           
            bar.append("rect")
                .attr("width", (xScale(hist_data[0].dx) - xScale(0)) - 1)
                .attr("height", function(d) { 
                                        return mini_h + mini_h_origin - yScale(d.y/tlt_sims); 
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
                   return color_oper(d["Operation Hours"]);
               })
               .attr("transform", "translate(0," + (0) + ")");
            
            //Create X axis
            board.g.append("g")
                    .attr("class", "axis")
                    .attr("id", "tooltip")
                    .attr("transform", "translate(0," + (mini_h+mini_h_origin) + ")")
                    .call(xAxis);
                    
            //Create Y axis
            board.g.append("g")
                    .attr("class", "axis")
                    .attr("id", "tooltip")
                    .attr("transform", "translate(" + (mini_w_origin + mini_w) + "," + (0) + ")")
                    .call(yAxis);
                    
            
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
            
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", mini_w_origin)
                   .attr("y", mini_h_origin + txt_size*1.75)
                   .attr("font-size", txt_size-15 + "px")
                   .attr("fill", "black")
                   .attr("text-anchor", "start")
                   .text("ChW supply temperature frequency");

            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", mini_w_origin)
                   .attr("y", mini_h_origin + mini_h + 150)
                   .attr("font-size", txt_size-10 + "px")
                   .attr("fill", color_potential(potential))
                   .attr("text-anchor", "start")
                   .text("Eliminating chiller potential is " + text_potential(twbp));
                   

            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("font-size", txt_size-15 + "px")
                   .attr("fill", "black")
                   .attr("text-anchor", "start")
                   .attr("transform", "translate(" + (mini_w_origin + mini_w + 60) + "," + (mini_w/2) + "), rotate(-90)")
                   .text("Percentage of simulations");
                   
            
            
            // draw legends- operation hours
            board.g.selectAll("g.oper-legend")
                   .data([9, 17, 23, 24])
                   .enter().append("rect")
                   .attr("id", "tooltip")
                   .attr('width', legend_bar_width)
                   .attr('height', 10)
                   .attr('y', mini_h_origin + mini_h)
                   .attr('x', function(d,i) {
                       return legend_bar_width*i; })
                   .attr('fill', function(d) {
                       return color_oper(d);
                   })
                   .attr("transform", "translate("+ (mini_w_origin) + "," + 90 + ")");
           
            board.g.selectAll("g.oper-legend")
                   .data([9, 17, 23, 24])
                   .enter().append("text")
                   .attr("id", "tooltip")
                   .attr("class", "legendClimates")
                   .attr('y', mini_h_origin + mini_h + 25)
                   .attr('x', function(d,i) {
                       return legend_bar_width*i + 10; })
                   .text(function(d){ return d; })
                   .attr("transform", "translate("+ (mini_w_origin) + "," + 90 + ")");
                
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("class", "legendClimates")
                   .attr('y', mini_h_origin + mini_h - 5)
                   .text("Operation hours")
                   .attr("transform", "translate("+ (mini_w_origin) + "," + 90 + ")");
                    
                    d3.select(this)
                      .attr("r", 50)
                      .style("fill", color_potential(potential))
            
            console.log("The percentile is " + twbp + " The potential is " + potential)
                })
        .on("mouseout", function(d) {
            d3.selectAll("#tooltip")
              .transition()
              .duration(50)
              .remove();
            
            d3.select(this)
              .transition()
              .duration(50)
              //.style("fill", select_chw_color)
              .attr("r", function(d){
                    return scale_pop(d.population)
              });
        })
        .on("click", function(d) {
            d3.selectAll("g.city").selectAll("circle")
              .transition()
              .duration(100)
              .attr("r", function(d){
                    return scale_pop(d.population)
              });
        });
     
    // draw city names by location
    city.append("text")
        .attr("x", 5)
        .attr("font-size", "20px")
        .text(function(d){ return d.city; })
    
    
    // draw legends- weather
    var legend_bar_width = 40;
    var legend_spc_weather = 3;
    var legend_climate_h = 100;
    board.g.selectAll("g.climate-legend")
           .data(d3.range(color_wea.domain()[0], color_wea.domain()[1]+1, legend_spc_weather))
           .enter().append("rect")
           .attr("class", "legendClimates")
           .attr('width', legend_bar_width)
           .attr('height', 10)
           .attr('y', h - legend_climate_h)
           .attr('x', function(d,i) {
               return legend_bar_width*i; })
           .attr('fill', function(d) {
               return color_wea(d);
           });
           
    board.g.selectAll("g.climate-legend")
           .data(d3.range(color_wea.domain()[0], color_wea.domain()[1]+1, legend_spc_weather))
           .enter().append("text")
           .attr("class", "legendClimates")
           .attr('y', h - (legend_climate_h - 25))
           .attr('x', function(d,i) {
               return legend_bar_width*i + 10; })
           .text(function(d){ return d; })
        
    board.g.append("text")
           .attr("class", "legendCaption")
           .attr('y', h - (legend_climate_h + 5))
           .text("Wetbulb temperature")
           
           
    // draw legends- city and bar color
    var legend_spc_city = 3;
    var legend_city_h = 40;
    board.g.selectAll("g.climate-legend")
           .data(d3.range(color_chw.domain()[0], color_chw.domain()[1]+1, legend_spc_city))
           .enter().append("rect")
           .attr("class", "legendClimates")
           .attr('width', legend_bar_width)
           .attr('height', 10)
           .attr('y', h - legend_city_h)
           .attr('x', function(d,i) {
               return legend_bar_width*i; })
           .attr('fill', function(d) {
               return color_chw(d);
           });
           
    board.g.selectAll("g.climate-legend")
           .data(d3.range(color_chw.domain()[0], color_chw.domain()[1]+1, legend_spc_city))
           .enter().append("text")
           .attr("class", "legendClimates")
           .attr('y', h - (legend_city_h - 25))
           .attr('x', function(d,i) {
               return legend_bar_width*i + 10; })
           .text(function(d){ return d; });
        
    board.g.append("text")
           .attr("class", "legendCaption")
           .attr('y', h - (legend_city_h + 5))
           .text("Chilled water supply temperature");
}

