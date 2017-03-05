

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).   
    board = dY.graph.addBoard("#dy-canvas",{inWidth: 960, inHeight:960, margin:40});
    console.log(board);
    
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
    
    // read and parse map geoJson
    var map = dObj;
    var features = topojson.feature(map, map.objects.tracts).features;

    var map_bounds = topojson.bbox(map);
    
    var counties = topojson.feature(map, map.objects.counties),
        selection = {type: "FeatureCollection", features: counties.features.filter(function(d) {
                 return d.id.slice(0,3);   
        })};
    
    // define scales
    var color_domain = [50, 150, 350, 750, 1500]
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);
    
    var mapScale = d3.scale.linear()
                   .domain([map_bounds[0], map_bounds[2]])
                   .range(board.dDims.xRange);
    
    var projection = d3.geoAlbers()
                       .parallels([34, 40.5])
                       .rotate([120, 0])
                       //.scale(100);
                       .fitSize([board.dDims.width, board.dDims.height]);
                           
    var path = d3.geoPath().projection(null);
        
    var points = get_all_points(path(counties));
    
    var sort_x = custom_sort(0);
    var sort_y = custom_sort(1);
    
    var sorted_points_x = sort_copy(points, sort_x);
    var sorted_points_y = sort_copy(points, sort_y);
    
    // define grid size
    var grid_x = 20;
    var grid_y = 20;
    var search_size = 20;
    
    var grid_lines_x = function(grid_x, search_size){
        var min_map_x = d3.min(points, function(d) { return d[0]; });
        var max_map_x = d3.max(points, function(d) { return d[0]; });
        
        var size_map_x = (max_map_x - min_map_x)/grid_x;
        
        var grid_arr = []
        for(var i = 0; i < grid_x; i += 1) {
            var grid_line = min_map_x + size_map_x*i;
            var max = grid_line + search_size;
            var min = grid_line - search_size;
            
            var pts = subset_points(points, min, max, 0);
            var max_y = d3.max(pts, function(d) { return d[1]; });
            var min_y = d3.min(pts, function(d) { return d[1]; });
            grid_arr.push([grid_line, min_y, grid_line, max_y]);
        };
        return grid_arr;
    };
    
    var grid_lines_y = function(grid_y, search_size){
        var min_map_y = d3.min(points, function(d) { return d[1]; });
        var max_map_y = d3.max(points, function(d) { return d[1]; });
        
        var size_map_y = (max_map_y - min_map_y)/grid_y;
        
        var grid_arr = []
        for(var i = 0; i < grid_y; i += 1) {
            var grid_line = min_map_y + size_map_y*i;
            var max = grid_line + search_size;
            var min = grid_line - search_size;
            
            var pts = subset_points(points, min, max, 1);
            var max_x = d3.max(pts, function(d) { return d[0]; });
            var min_x = d3.min(pts, function(d) { return d[0]; });
            grid_arr.push([min_x, grid_line, max_x, grid_line]);
        };
        return grid_arr;
    };
    
    
    var lines_x = grid_lines_x(grid_x, search_size);
    var lines_y = grid_lines_y(grid_y, search_size);
    
    
    //max_x = d3.max(points, function(d) { return d[0]; });
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
           

    /*
    // general array of array sorter
    var compFunc = function (a, b) {
            var len = a.length > b.length ? b.length : a.length;

            for(var i=0; i<len; ++i) {
                if(a[i] - b[i] !== 0)
                    return a[i] - b[i];
            }
            return (a.length - b.length);
    };
    */
           
}

