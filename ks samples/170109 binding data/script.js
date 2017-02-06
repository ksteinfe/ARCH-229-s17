

function OnDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    d3.select("#dy-canvas").selectAll("p")
        .data(dObj)
        .enter()
        .append("p")
        .style("color", function(d) {
            if (d.Deliciousness > 6) { return "red"; } 
            else { return "black"; }
        })
        .text(function(d) { return d.Food; });
      
}

