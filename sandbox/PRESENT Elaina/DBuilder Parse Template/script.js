

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
        
      
}


handleMultDBuilderFileUpload = function (filedata) {
    console.log(filedata);
	console.log("5");
	var dataDBasEPlus = [];
	var headers = [];//new array(filedata.length()-2)
    for (var filename in filedata){
        console.log( filename );
		console.log("3");//keeping track of where I am
        var content = filedata[filename] ;
		var newArray = new Array(content[0].length)
		dataDBasEPlus.push(newArray) //initializing space for the new data
		//this next chunk converts the date/time string. Does not yet deal with weird DesignBuilder edge cases (!)
		var j = 0, n = content.length;
		for (var j = 0; j<n; j++){
			var datestamp = content[j][0];
			var month = doubleDigit(datestamp.slice(0,datestamp.indexOf("/")));
			var day =  doubleDigit(datestamp.slice(datestamp.indexOf("/"), datestamp.lastIndexOf("/")));
			var hour = doubleDigit(datestamp.slice(datestamp.indexOf(" "), datestamp.indexOf(":")));
			var minute = doubleDigit(datestamp.slice(datestamp.indexOf(":"), datestamp.lastIndexOf(":")));
			content[j][0] = (month + '/' + day + ' ' + hour +":" + minute + ":00");
		}
		//this next chunk combines processes the header and combines things into one file
		var k = content[0].length;//content.length should be the number of rows (i.e. 8762), content[0].length should be the number of columns (different data types)
		//i loops throgh columns of each file (in an Excel sense)
		for (var i = 0; i<k; i++){ 
			console.log("12");
			var headerNew = (filename+":"+ content[i][0]+"[" + content[i][1] + "]"); //creates EPlus style header from DB headers
			console.log(headerNew);
			headers.push(headerNew);//adds EPlus style header to the list of headers
			dataDBasEPlus[i].push(content[i].slice(2)); //adds all non-header rows to the data
		}
	}
	console.log("20");
	console.log(dataDBasEPlus)
}	
	
doubleDigit = function(numstring){
	if (numstring.length<2){
		return numstring;
	}
	else{
	return ("0"+numstring);
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