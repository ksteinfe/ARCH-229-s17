

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    
	//step 1: remove the zone sizes, count # of zones
	TempsObj = dObj[1:]
	zoneCount = 
	
	
	//step 2: define comfort range
	var minComf = 68
	var maxComf = 78
	
	//step 3: find max and min temperatures in data
	
		
	//step 4: Create SVG graphic board element to draw on, put the center convenient for radial, x axis up
	board = dY.graph.addBoard("#dy-canvas",{inWidth: 300, inHeight:300, margin:50});
	var ctrdGrp = board.g.append("g")
        .attr("transform", "translate(" + board.dDims.width / 2 + "," + board.dDims.height / 2 + ") rotate(-90)");
    
    var textPadding = 5;
    var ctrOffset = 20;	
	
	//step 5: define inner and outer radius of each ring
	rad = 30
	rads=[]
	for z in zoneCount: rads.append(rad), rad = (rad-30) //this is python, need to make it javascript

	//step 6: figure out comfort and non-comfort temps
	for each zone:
	if temp is in comfort range, --> comfort, else scaled magnitude of distance from comfort range
	
	//step 6: define arcs
	n=0
	for z in zoneCount:
		for all the data in that zone:
			var arc1 = d3.svg.arc()
						.innerRadius(rads[n])
						.outerRadius(rads[n+1]);
							n=n+1
							
			//var pie = d3.layout.pie();
			
	//Do things with colors
			var color = d3.scale.category10();
			
	//Set up groups and draw arc paths
		for z in zoneCount: 	
			var arcs = svg.selectAll("g.arc")
						  .data(pie(zoneTemps))
						  .enter()
						  .append("g")
						  .attr("class", "arc1")
						  .attr("transform", "translate(" + OR1 + "," + OR1 + ")");
			
			arcs.append("path")
			    .attr("fill", function(d, i) {
			    	return color(i);
			    })
			    .attr("d", arc1);
			


