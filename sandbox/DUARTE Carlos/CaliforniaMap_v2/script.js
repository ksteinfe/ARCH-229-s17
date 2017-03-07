

function onDataLoaded(dObj, map) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    console.log(map);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth:960, inHeight:960, margin:40});
    console.log(board);
    
    // define variables used later
    var w = board.dDims.width,
        h = board.dDims.height;
    
    var map_scale = 4000;
    map = topojson.simplify(topojson.presimplify(map));                 // simplify topojson
    map = topojson.quantize(map, 1e5);                                  // reduce size of topology
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
                       .translate([w/2, h/2]);
    
    var path = d3.geo.path()
                 .projection(projection);
    
    
    // draw county boundaries
    board.g.append("path")
        .datum(topojson.mesh(map, map.objects.climates, function(a,b){ return a === b; }))
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
        .attr("r", 3)
        .style("fill", "lime")
        .style("opacity", 0.75)
       .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0] + w/2;
            var yPosition = d3.mouse(this)[1] + h/2;
            
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", xPosition)
                   .attr("y", yPosition)
                   //.attr("text-anchor", "middle")
                   .attr("font-family", "sans-serif")
                   .attr("font-size", "11px")
                   .attr("font-weight", "bold")
                   .attr("fill", "black")
                   .text(d.name + " "+ xPosition + " " + yPosition);
                   
            d3.select(this)
              .style("fill", "#509e2f")
              .attr("r", 10)

        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").remove();
            
            d3.select(this)
              .transition()
              .duration(250)
              .style("fill", "lime")
              .attr("r", 3);
        });
        
    city.append("text")
        .attr("x", 5)
        .text(function(d){ return d.city; })
       .on("mouseover", function(d) {
            var xPosition = d3.mouse(this)[0] + w/2;
            var yPosition = d3.mouse(this)[1] + h/2;
            
            board.g.append("text")
                   .attr("id", "tooltip")
                   .attr("x", xPosition)
                   .attr("y", yPosition)
                   .attr("text-anchor", "middle")
                   .attr("font-family", "sans-serif")
                   .attr("font-size", "11px")
                   .attr("font-weight", "bold")
                   .attr("fill", "black")
                   .text(d.Zone);
                   
            d3.select(this)
              .style("fill", "#509e2f")
              

        })
        .on("mouseout", function(d) {
            d3.select("#tooltip").remove();
            
            d3.select(this)
              .transition()
              .duration(250)
              .style("fill", "black");
        });
    /*

        
        board.g.append("g")
           .attr("class", "circles_x")
           .selectAll("line")
           .data(lines_x)
           .enter().append("line")
           .attr("x1", function(d) {
               return d[0];
           })
           .attr("x2", function(d) {
               return d[2];
           })
           .attr("y1", function(d) {
               return d[1];
           })
           .attr("y2", function(d) {
               return d[3];
           })
           .attr("stroke", "#ccc");
           
           
    // split svg path elements in individual strings
    var split_path_element = function(str) {
            return str.split(/(?=[LMC])/)
    };  
    
    // get each individual string of numbers and pair them up
    var point_path_element_array = function(d) {
            var points_array = d.slice(1, d.length).split(',');
            var pairs_array = [];
            
            for(var i = 0; i < points_array.length; i += 2){
                pairs_array.push([+points_array[i], +points_array[i+1]]);
            };
            return pairs_array;
    };
    
    // combine each pair of number into a single array
    var combine_array = function(points) {
            var concat_points = [];
            for(var i = 0; i < points.length; i += 1){
                for(var j = 0; j < points[i].length; j += 1){
                    concat_points.push(points[i][j]);
                };
            };
            return concat_points;
    };
    
    // combine above functions into one. Input is path element
    var get_all_points = function(str) {
            var str_array = split_path_element(str);
            
            var all_points = [];
            for(var i = 0; i < str_array.length; i += 1){
                all_points.push(point_path_element_array(str_array[i]))
            }
            return combine_array(all_points);
    };
    
    // function to sort array by either x or y
    var custom_sort = function(pos) {
        var comp_func = function(a, b) {
            return (a[pos] - b[pos]);
            }
        return comp_func;
        }
    
    // function to sort without modifying original data
    var sort_copy = function(arr, custom_sort){
        return arr.slice(0).sort(custom_sort).sort(custom_sort);
    };
    
    var subset_points = function(arr, min, max, pos) {
            var len = arr.length;
            var subset = [];
            for(var i = 0; i < len; i += 1){
                if (arr[i][pos] >= min && arr[i][pos] <= max) {
                    subset.push(arr[i])
                }
            }
            return subset;
    };
    
    var customScale = function(scaleFactor) {
        return d3.geoTransform({
            point: function(x, y) {
                this.stream.point((x * scaleFactor), y  * -scaleFactor);
            }
        });
    };
    
    var get_filter_column = function(csv, key, value, column){
            var nested_dday = d3.nest()
                   .key(function(d) {return d[key];})
                   .entries(csv);
    
            var dataFiltered = nested_dday.filter(function(d) {return d.key == value; });
            if (dataFiltered.length  === 0){
                return NaN;
            } else {
                var filter_values = d3.values(dataFiltered[0].values).map(function(d) { return d[column]; });
                return filter_values;
            };

    };
    
    // define scales
    var color_domain_chw = [10, 26]
    var color_chw = d3.scale.quantile() //designate quantile scale generator
                            .range(["#016eae","#7bb3d1", "#dddddd"])
                            .domain(color_domain_chw);
    
    // map processsing
    var path = d3.geo.albers()
                 .parallels([34, 40.5])
                 .rotate([120, 0]);
                 //.fit([960, 960]);
    
    
    
    var points = get_all_points(path(climates));
    
    var min_map_x = d3.min(points, function(d) { return d[0]; });
    var max_map_x = d3.max(points, function(d) { return d[0]; });
    var min_map_y = d3.min(points, function(d) { return d[1]; });
    var max_map_y = d3.max(points, function(d) { return d[1]; });
    
    var map_bounds = [min_map_x, max_map_x, min_map_y, max_map_y];
    var map_mid_x = map_bounds[1] - map_bounds[0];
    var map_mid_y = map_bounds[3] - map_bounds[2];
    
    var map_scale_y = board.dDims.height/(map_bounds[3] - map_bounds[2]);
    var map_scale_x = board.dDims.width/(map_bounds[1] - map_bounds[0]);
    
    var mod_map_scale = map_scale_y < map_scale_x ? map_scale_y : map_scale_x; // scale to fit canvas
    
    // data processing
    
    // drawing map
    board.g.append("g")
        .attr("class", "climate zones")
        .selectAll("path")
        .data(climates.features)
        .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) {
             var filter_values = get_filter_column(dObj, "Design Day", cz_rev[d.properties.Zone], "ChW Supply");
             var percentile = d3.mean(filter_values);
             return color_chw(percentile);
        })
        .attr("transform", "scale(" + (mod_map_scale) + ") " + "translate(" + (1*map_bounds[1]) + "," + (-1*map_bounds[2]) +")");
        
        
    // draw county boundaries
    board.g.append("path")
        .datum(climate_boundary)
        .attr("class", "climate-boundaries")
        .attr("d", path);
    */
    /*
    // draw polygon shapes
    board.g.append("g")
           .attr("class", "region")
           .selectAll("path")
           .data(features)
           .enter().append("path")
           .attr("d", path)
           .style("fill", function(d) {
               return color(d.properties.density);
           });
    
    // draw lines
    board.g.append("g")
           .attr("class", "circles_x")
           .selectAll("line")
           .data(lines_x)
           .enter().append("line")
           .attr("x1", function(d) {
               return d[0];
           })
           .attr("x2", function(d) {
               return d[2];
           })
           .attr("y1", function(d) {
               return d[1];
           })
           .attr("y2", function(d) {
               return d[3];
           })
           .attr("stroke", "#ccc");
    
    // draw lines
    board.g.append("g")
           .attr("class", "circles_y")
           .selectAll("line")
           .data(lines_y)
           .enter().append("line")
           .attr("x1", function(d) {
               return d[0];
           })
           .attr("x2", function(d) {
               return d[2];
           })
           .attr("y1", function(d) {
               return d[1];
           })
           .attr("y2", function(d) {
               return d[3];
           })
           .attr("stroke", "#ccc");
    
    
    // draw county boundaries
    board.g.append("path")
        .datum(counties)
        .attr("class", "state selected-boundary")
        .attr("d", path);
        */
    /*
    
    var get_csv_column = function(csv, column){
        var arr = [];
        for (i = 0; i < csv.length; i++){
            if (csv[i][column] >= 0) {
                arr.push(csv[i][column]);
            }
        }
        return arr;
    };
    
    d3.nest()
      .key(function(d) {return d["Start Time"]; } )
      .entries(dObj);
    */
           
}

