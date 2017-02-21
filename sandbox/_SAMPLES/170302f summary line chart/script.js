

function onDataLoaded(dObj) {
    console.log("data is loaded, i'm ready to go!");
    console.log(dObj);
    
    // summary information for each day of the year
    var dSum = dObj.dailySummary();
    console.log(dSum);
    
}

