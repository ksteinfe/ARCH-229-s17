


function onDataLoaded(dObj) {
    //dObj.ticks = dObj.ticks.slice(0,744);
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
    
    zonekey = ["SimpleHouse_Downstairs","Operative Temperature[C]"];
    
    console.log("domain is: " + dObj.metaOf(zonekey).domain)
    console.log("value for hour 0 is: " + dObj.ticks[0].valueOf(zonekey))
    
    
}

