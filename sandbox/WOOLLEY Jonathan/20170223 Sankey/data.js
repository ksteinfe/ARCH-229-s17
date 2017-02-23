
//var mockup = {
//    "nodes":[
//        {
//            "name":"Walls", 
//            "category":"foo", 
//            "stored": 20
//            "children":[
//                {"name": "wall 1", "category", "stored":10},
//                {"name": "wall 2", "category", "stored":10}
//            ]
//        },
//    
//    ],
//    "parentLinks":[
//        {"source":0,"target":1,"value":20},
//        {"source":1,"target":2,"value":124.729}
//    ]    
//    "childLinks":[
//        {"source":[0,0],"target":[1,1],"value":10},
//        {"source":[0,0],"target":[1,0],"value":10}
//    ]
//}



var dObj = {
    "nodes":[
        {"name":"Lights", "category":"foo", "wval": 10}, //0 //sources only
        {"name":"People", "category":"foo", "wval": 10}, //1
        {"name":"Equipment", "category":"foo", "wval": 10},  //2      
        {"name":"Solar", "category":"foo", "wval": 10}, //3

        {"name":"Infiltration(+)", "category":"foo", "wval": 10}, //4 //sources that are also sinks
        {"name":"Ventilation(+)", "category":"foo", "wval": 10}, //5
        {"name":"Environment(+)", "category":"foo", "wval": 10}, //6
		{"name":"Heating and Cooling(+)", "category":"foo", "wval": 10}, //7
		
		{"name":"Windows", "category":"baz", "wval": 10}, //8 //source, sink, and storage
        {"name":"Surfaces", "category":"baz", "wval": 80}, //9
        {"name":"Zone Air", "category":"baz", "wval": 20}, //10		
		
		{"name":"Infiltration(-)", "category":"foo", "wval": 10}, //11 //sources that are also sinks
        {"name":"Ventilation(-)", "category":"foo", "wval": 10}, //12
        {"name":"Environment(-)", "category":"foo", "wval": 10}, //13
		{"name":"Heating and Cooling(-)", "category":"foo", "wval": 10}, //14
    ],
	
	
    "links":[
        {"source":0,"target":8,"value":10},	
		{"source":0,"target":8,"value":10},	
        {"source":0,"target":9,"value":0.001},
        {"source":0,"target":10,"value":0.001},
        {"source":0,"target":13,"value":0.001},
		
        {"source":1,"target":8,"value":81.144},
        {"source":1,"target":9,"value":35},
        {"source":1,"target":10,"value":35},
        {"source":1,"target":13,"value":11.606},
		
        {"source":2,"target":8,"value":63.965},
        {"source":2,"target":9,"value":75.571},
        {"source":2,"target":10,"value":10.639},
        {"source":2,"target":13,"value":22.505},
		
        {"source":3,"target":8,"value":46.184},
        {"source":3,"target":9,"value":104.453},
		
        {"source":4,"target":10,"value":113.726},
		
        {"source":5,"target":10,"value":27.14},
		
        {"source":6,"target":8,"value":30},
		{"source":6,"target":8,"value":40},
		{"source":6,"target":8,"value":50},
		{"source":6,"target":8,"value":60},
		{"source":6,"target":8,"value":70},
        {"source":6,"target":9,"value":37.797},
		{"source":6,"target":10,"value":4.412},
		
        {"source":7,"target":8,"value":40.858},
        {"source":7,"target":9,"value":56.691},
        {"source":7,"target":10,"value":7.863},
		
        //{"source":8,"target":9,"value":90.008}, // I dont think this exists
        //{"source":8,"target":10,"value":93.494}, // This can occur, but leave out because we want all storage to show up in the same column
        {"source":8,"target":13,"value":40.719},
        {"source":8,"target":14,"value":82.233},
		
        //{"source":9,"target":8,"value":0.129}, // I don't think this exists
        //{"source":9,"target":10,"value":1.401}, // This can occur, but leave out because we wat all storage to show up in same column
        {"source":9,"target":13,"value":151.891},
        {"source":9,"target":14,"value":2.096},
		
        //{"source":10,"target":8,"value":48.58}, // Leave this out for now because relationship can only flow one way
        //{"source":10,"target":9,"value":7.013}, // Leave this out for now because relationship can only flow one way
        {"source":10,"target":11,"value":10},
        {"source":10,"target":12,"value":20},
        {"source":10,"target":14,"value":30},

    ]
};
