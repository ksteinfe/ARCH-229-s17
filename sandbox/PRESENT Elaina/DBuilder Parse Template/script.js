

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
        
      
}



handleMultDBuilderFileUpload = function (evt) {
    console.log( evt.target.files );
    /*
    var file = evt.target.files[0];

    Papaparse parses a single file. we'll need a loop, collect results, and only then pass along to handleParseDBuilderResults
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            handleParseDBuilderResults(results,onDataLoaded);
        }
    });
    */
}


ALTERNATE_handleMultDBuilderFileUpload = function (evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        splt = this.result.split("\n");
        
        head = splt.slice(0,8).join("\n");
        body = splt.slice(8,splt.length).join("\n");
        
        console.log("done reading this file");
        
        Papa.parse(body, {
            delimiter: ",",
            skipEmptyLines: true,
            header: false,
            dynamicTyping: true,
            complete: function(results) {
                dY.parser.handleParseEPWResults(head, results,onDataLoaded);
            }
        });
    }
    reader.readAsText(file);
}



handleParseDBuilderResults = function (results, callback) {
    dY.report("dy: Parsing DBuilinder Results File");
    /*
    
    // Handle Parse Errors
    if (!dY.parser.handleParseErrors(results)){
        dY.report("Parser failed. Quitting.");
        return false;
    }
    
    
    // Handle Parsed Fields
    //
    schema = {};
    if (results.meta.fields.length > 0){
        dY.report("dy: Parser found "+results.meta.fields.length+" columns (not including Date/Time)")
        
        // find zone strings
        zoneStrings = new Set();
        results.meta.fields.forEach(function(field,n) {
            if (!dY.parser.stringToZoneKey(field)) return;
            zoneStrings.add(dY.parser.stringToZoneKey(field)[0]);
        });
        zoneStrings = Array.from(zoneStrings);
        
        // construct zoneKeys
        zoneStrings.forEach(function(zoneStr,n) {
            schema[zoneStr] = {};
            results.meta.fields.forEach(function(field,n) {
                key = dY.parser.stringToZoneKey(field);
                //if (key && key[0] == zoneStr) schema[zoneStr].push(key[1]);
                if (key && key[0] == zoneStr) schema[zoneStr][key[1]] = {};
            });
        });
        
    }
    
    // Handle Hourly Data
    //
    dY.report("dy: Parser found "+results.data.length+" rows. Parser doesn't care about the number of rows nor their order.")
    
    // create hourly ticks
    ticks = [];
    results.data.forEach(function(row,n) {
        hourOfYear = dY.dt.dateToHourOfYear( dY.dt.dateStringToDate(row["Date/Time"]) );
        timespan = dY.timeSpan.hourOfYear(hourOfYear);
        data = {};
        for (var zon in schema) {
            data[zon] = {};
            for (var key in schema[zon]) {
                value = row[dY.parser.zoneKeyToString(zon,key)];
                data[zon][key] = value;
            }
        }
        ticks.push( new dY.Tick(timespan, data)  );
        
    });
    
    
    // fill out schema information
    schema = dY.util.summarizeTicks(schema, ticks);    
    
    yr = new dY.Year(schema,ticks)
    if (typeof(callback)==='undefined') {
        return yr;
    } else {
        callback(yr);
    }    
   */
}