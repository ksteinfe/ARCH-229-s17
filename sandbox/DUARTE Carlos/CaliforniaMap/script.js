

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
    
    var sort_copy = function(arr, custom_sort){
        return arr.slice(0).sort(custom_sort).sort(custom_sort);
    };
    
    var color_domain = [50, 150, 350, 750, 1500]
    
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);
    
    var projection = d3.geoAlbers()
                       .parallels([34, 40.5])
                       .rotate([120, 0])
                       .fitSize([board.dDims.width, board.dDims.height]);
                           
    var path = d3.geoPath().projection(null);
    
    var map = dObj;
    var features = topojson.feature(map, map.objects.tracts).features;

    var map_bounds = topojson.bbox(map);
    
    var counties = topojson.feature(map, map.objects.counties),
        selection = {type: "FeatureCollection", features: counties.features.filter(function(d) {
                 return d.id.slice(0,3);   
        })};
           
    var points = get_all_points(path(counties));
    
    var sort_x = custom_sort(0);
    var sort_y = custom_sort(1);
    
    var sorted_points_x = sort_copy(points, sort_x);
    var sorted_points_y = sort_copy(points, sort_y);
    
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

