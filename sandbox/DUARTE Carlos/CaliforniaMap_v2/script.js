

function onDataLoaded(dObj, map) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    console.log(map);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth:900, inHeight:800, margin:40});
    console.log(board);
    
    // define variables used later
    var map_scale = 2000;
    var climates = topojson.feature(map, map.objects.ca_climate);
    
    //zone numbers
    var cz = {
        "CZ01RV2": 1,
        "CZ02RV2": 2,
        "CZ03RV2": 3,
        "CZ04RV2": 4,
        "CZ05RV2": 5,
        "CZ06RV2": 6,
        "CZ07RV2": 7,
        "CZ08RV2": 8,
        "CZ09RV2": 9,
        "CZ10RV2": 10,
        "CZ11RV2": 11,
        "CZ12RV2": 12,
        "CZ13RV2": 13,
        "CZ14RV2": 14,
        "CZ15RV2": 15,
        "CZ16RV2": 16
    };
    
    var cz_rev = {
        1: "CZ01RV2",
        2: "CZ02RV2",
        3: "CZ03RV2",
        4: "CZ04RV2",
        5: "CZ05RV2",
        6: "CZ06RV2",
        7: "CZ07RV2",
        8: "CZ08RV2",
        9: "CZ09RV2",
        10: "CZ10RV2",
        11: "CZ11RV2",
        12: "CZ12RV2",
        13: "CZ13RV2",
        14: "CZ14RV2",
        15: "CZ15RV2",
        16: "CZ16RV2"
    };
    
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
    var path = d3.geo.path().projection(customScale((1/map_scale)));
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
        .attr("d", path)
        .attr("transform", "scale(" + (mod_map_scale) + ") " + "translate(" + (1*map_bounds[1]) + "," + (-1*map_bounds[2]) +")");
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

