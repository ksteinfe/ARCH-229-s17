d3.select("#download")
    .on("mouseover", writeDownloadLink);

function writeDownloadLink(){
    var html = d3.select("svg")
        .attr("title", "svg_title")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    d3.select(this)
        .attr("href-lang", "image/svg+xml")
        .attr("href", "data:image/svg+xml;base64,\n" + btoa(html))
        .on("mousedown", function(){
            if(event.button != 2){
                d3.select(this)
                    .attr("href", null)
                    .html("Use right click");
            }
        })
        .on("mouseout", function(){
            d3.select(this)
                .html("Download");
        });
}
