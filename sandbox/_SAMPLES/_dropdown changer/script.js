

function onDataLoaded(dObj) {
    alert(dropDownValue);
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // add a board (an SVG) to the canvas. Uses a DY Utility function to easily add an svg and calculate inner and outer dimensions. Returns an object of {g (an SVG), bDims (the board dimensions), dDims (the draw dimensions)} Each dimensions have width, height, xRange, and yRange members.
    // the board SVG contains a "group" to handle the margin effectively. This inner group works as a sort of inner SVG that contains an origin translated by the x and y offsets. Think of the new 0,0 point of your working SVG as the inner drawing origin of this group. Dimensions are accessible via board.dDims (drawing dimensions) and board.bDims (board dimensions).    
    board = dY.graph.addBoard("#dy-canvas",{inWidth:40, inHeight:20,margin:30});
    console.log(board);  
    
}

