

function onDataLoaded(dObj) {
    console.log("dy: data is loaded, i'm ready to go!");
    console.log(dObj);
    
        
      
}


handleMultDBuilderFileUpload = function (filedata) {
    console.log(filedata);
    var headCount = 2; // the number of header rows that we expect
	var combinedContentRows = new Array(8760);//currently only works with 8760 data -- but upside is it gets rid of any extra rows
	var combinedHeaderRows = "Date/Time";
    console.log(combinedContentRows.length);
    for (var filename in filedata){
        console.log( filename );
        var fileContent = filedata[filename] ;
		var splitContent = fileContent.split("\n");
		//console.log("rowcount: " + splitContent.length);//content.length should be the number of rows (i.e. 8762). It is currently 8764.
        
        headRows = splitContent.slice(0,2);
        contentRows = splitContent.slice(2);
        
        
        // Step 1: adding to combinedHeaderRows
        //
        var firstSplitHeadRow = headRows[0].split(",");
        var secondSplitHeadRow = headRows[1].split(",");
        if (firstSplitHeadRow[firstSplitHeadRow.length-1].trim() == "") firstSplitHeadRow.pop();
        if (secondSplitHeadRow[secondSplitHeadRow.length-1].trim() == "") secondSplitHeadRow.pop();
                
        //console.log(firstSplitHeadRow);
        //console.log(secondSplitHeadRow);
        var fname = filename.slice(0,-4);
        for (var col=1; col<firstSplitHeadRow.length-1; col++){
            var str = fname+":"+ firstSplitHeadRow[col].slice(1)+"[" + secondSplitHeadRow[col].slice(1) + "]"; //creates EPlus style header from DB headers. NOTE: cutting to -1 takes the last character off! I fixed it to just not take a 2nd param.
            combinedHeaderRows = combinedHeaderRows + "," + str;
        }
		//Step 2: dealing with date
		//EPlus dates look like this: " 01/01  08:00:00"
		//DB dates look like this: "1/1/2002  1:00:00 AM"
		//loop
		for (var row = 0; row<(contentRows.length-1); row++){
			var month = doubleDigit(contentRows[row].slice(0,contentRows[row].indexOf("/")));
			var day = doubleDigit(contentRows[row].slice(contentRows[row].indexOf("/")+1, contentRows[row].lastIndexOf("/")));
			if (contentRows[row].indexOf(" ")== -1){
				var loc = contentRows[row].length;
			} else{
				var loc = contentRows[row].indexOf(" ");
			}
			//LOL all that and I didn't actually need the year
//			var year = contentRows[row].slice(loc-2, loc);
			if (contentRows[row].indexOf(" ")== -1){
				var hour = 24;
			} else {
				var hour = contentRows[row].slice(contentRows[row].indexOf(" "),contentRows[row].indexOf(" ") +2);
					if((contentRows[row].slice(contentRows[row].lastIndexOf(" "), contentRows[row].lastIndexOf(" ") +2) =="PM")&& hour != '12' ){
						hour = hour + 12;
					}
			}
			combinedContentRows[row]=  month + '/' + day +  ' ' + hour + ":00:00"
        }
        // Step 3: adding to combinedContentRows
        //instructions: content string needs an array of strings, one for each row. Initialize a string for each row (or, for every row in file, initialize a string), ...after split, check how many items, if 0 or 1, omit row
		//console.log(contentRows.length)//this is # rows. It is 8762 (should be 2 shorter)
		for(var row = 0; row<(contentRows.length-1); row++){//iterate over rows
	//		for (var col = 1; col<(contentRows[0].length-1); col++){
			var str = contentRows[row].slice(contentRows[row].indexOf(",")+1)
			res = str.replace(/"/g,'')//they were all in quotes for some reason. now they're not. Did we want them to be?
			combinedContentRows[row] = combinedContentRows[row]+ "," +res;//works! has a trailing comma I don't like though
	//			}
        }
	//console.log(combinedContentRows[0].length);
    }
    console.log(combinedContentRows[0]);
	//trying to get rid of that stupid last comma. Not yet successful.
	for (var row = 0; row <combinedContentRows.length-1; row++){
		if(combinedContentRows[row][combinedContentRows[row].length-1]==","){
			console.log('final comma');
			combinedContentRows[row] = combinedContentRows[row].slice(0,-1);
		}
	}
    console.log(combinedContentRows[5]);
}	





_____handleMultDBuilderFileUpload = function (filedata) {
    console.log(filedata);
	console.log("5");
	var dataDBasEPlus = [];
	var headers = [];//new array(filedata.length()-2)
    for (var filename in filedata){
        console.log( filename );
		console.log("3");//keeping track of where I am
        var content = filedata[filename] ;
		var sContent = content.split("\n");
		console.log("sContentrows" + sContent.length);//content.length should be the number of rows (i.e. 8762), content[0].length should be the number of columns (different data types). Checking if this is true. OK not true. need to do the split at newline thing.
        
        
        
		var newArray = new Array();
		dataDBasEPlus.push(newArray); //initializing space for the new data
		//this next chunk converts the date/time string. Does not yet deal with weird DesignBuilder edge cases (!)
		var j = 0, n = sContent.length;
		for (var j = 0; j<n; j++){
			var datestamp = sContent[j][0];
			var month = doubleDigit(datestamp.slice(0,datestamp.indexOf("/")));
			var day =  doubleDigit(datestamp.slice(datestamp.indexOf("/"), datestamp.lastIndexOf("/")));
			var hour = doubleDigit(datestamp.slice(datestamp.indexOf(" "), datestamp.indexOf(":")));
			var minute = doubleDigit(datestamp.slice(datestamp.indexOf(":"), datestamp.lastIndexOf(":")));
			sContent[j][0] = (month + '/' + day + ' ' + hour +":" + minute + ":00");
		}
		//this next chunk combines processes the header and combines things into one file
		var k = sContent[0].length;
		//i loops throgh columns of each file (in an Excel sense)
		for (var i = 0; i<k; i++){ 
			console.log("12");
			var headerNew = (filename+":"+ sContent[i][0]+"[" + sContent[i][1] + "]"); //creates EPlus style header from DB headers
			console.log(headerNew);
			headers.push(headerNew);//adds EPlus style header to the list of headers
			dataDBasEPlus[i].push(sContent[i].slice(2)); //adds all non-header rows to the data
		}
        
	}
	console.log("20");
	console.log(dataDBasEPlus)
}	
	
doubleDigit = function(numstring){
	//console.log(numstring);
	//console.log(numstring.length);
	simplestring = numstring.replace(/"/g,'')
	if (simplestring.length>=2){
		return simplestring;
	} else{
		//console.log('adding0');
		return ("0"+simplestring);
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
	//console.log("1");
    multiRead(evt.target.files);
}

multiRead = function(files){
    
    var j = 0, k = files.length;
     for (var i = 0; i < k; i++) {
         var reader = new FileReader();
		 //console.log("2");
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
		 //console.log("10");
     }
    
}



// goal: make it into one giant string to feed in as though it were from E-Plus


DONOTUSE_handleMultDBuilderFileUpload = function (evt) {
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