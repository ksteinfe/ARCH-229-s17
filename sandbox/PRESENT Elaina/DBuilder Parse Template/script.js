

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
        
      
}



handleMultDBuilderFileUpload = function (filedata) {
    console.log(filedata);
    for (var filename in filedata){
        console.log( filename );
        var content = filedata[filename] ;
    }
    

    
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


// global variable
var readFileData = new Object;

handleMultFileUpload = function (evt) {
    multiRead(evt.target.files);
}

multiRead = function(files){
    
    var j = 0, k = files.length;
     for (var i = 0; i < k; i++) {
         var reader = new FileReader();
         reader.name = files[i].name;
         reader.onloadend = function (evt) {
             //console.log(evt);
             if (evt.target.readyState == FileReader.DONE) {
                 readFileData[this.name] = evt.target.result;
                 j++;
                 if (j == k){
                     //alert('All files read');
                     handleMultDBuilderFileUpload(readFileData);
                 }
             }
         };
         reader.readAsText(files[i]);
     }
    
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


