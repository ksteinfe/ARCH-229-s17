

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
        
      
}


handleMultDBuilderFileUpload = function (filedata) {
    console.log(filedata);
	console.log("5");
	var dataDBasEPlus = [];
	var headers = []
    for (var filename in filedata){
        console.log( filename );
		console.log("3");
        var content = filedata[filename] ;
		var j = 0, k = content[0].length;
		//i loops throgh columns of each file (in an Excel sense)
		for (var i = 0; i<k, i++){ 
			console.log("12");
			var headerNew = (fileName+":"+ content[i][0]+"[" + content[i][1] + "]"); //creates EPlus style header from DB headers
			console.log(headerNew);
			headers.push(headerNew);//adds EPlus style header to the list of headers
			var timeEP = 0;//to do: write procedure to convert date format
			var dataDBasEPlus[i].push(content[i].slice(2)); //adds all non-header rows to the data thing
			}
		}
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
	console.log("1");
    multiRead(evt.target.files);
}

multiRead = function(files){
    
    var j = 0, k = files.length;
     for (var i = 0; i < k; i++) {
         var reader = new FileReader();
		 console.log("2");
         reader.name = files[i].name;
         reader.onloadend = function (evt) {
             //console.log(evt);
             if (evt.target.readyState == FileReader.DONE) {
                 readFileData[this.name] = evt.target.result;
                 j++;
                 if (j == k){
                     //alert('All files read');
                     handleMultDBuilderFileUpload(readFileData);
					 //ALTERNATE_handleMultDBuilderFileUpload(readFileData);
                 }
             }
         };
         reader.readAsText(files[i]);
		 console.log("10");
     }
    
}



// goal: make it into one giant string to feed in as though it were from E-Plus


ALTERNATE_handleMultDBuilderFileUpload = function (evt) {
	console.log("4");
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        splt = this.result.split("\n");
        
		//(1)
        head = splt.slice(0,8).join("\n");
        body = splt.slice(8,splt.length).join("\n");
        console.log("done reading this file");
        
        Papa.parse(body, {
            delimiter: ",",
            skipEmptyLines: true,
            header: false,
            dynamicTyping: true,
            complete: function(results) {
                dY.parser.handleParseEPlusResults(head, results,onDataLoaded);//(3)
            }
        });
    }
    reader.readAsText(file);
}


makeEPlusDateStamp = function(DBdate){
	;
}

makeEPlusHeader = function(){
	;
}