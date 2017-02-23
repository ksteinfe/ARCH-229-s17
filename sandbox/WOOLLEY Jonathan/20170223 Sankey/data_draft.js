
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
        {"name":"Lights", "category":"foo", "wval": 10},
        {"name":"People", "category":"bar", "wval": 10},
        {"name":"Equipment", "category":"qux", "wval": 10},      
        {"name":"Solar", "category":"baz", "wval": 10},

        {"name":"Infiltration(+)", "category":"baz", "wval": 10},
        {"name":"Ventilation(+)", "category":"baz", "wval": 10},
        {"name":"Environment(+)", "category":"baz", "wval": 10},
		{"name":"Heating and Cooling(+)", "category":"baz", "wval": 10},
		
		{"name":"Windows", "category":"baz", "wval": 10},
        {"name":"Surfaces", "category":"baz", "wval": 10},
        {"name":"Zone Air", "category":"baz", "wval": 10},	
		
		{"name":"Infiltration(-)", "category":"baz", "wval": 10},
        {"name":"Ventilation(-)", "category":"baz", "wval": 10},
        {"name":"Environment(-)", "category":"baz", "wval": 10},
		{"name":"Heating and Cooling(-)", "category":"baz", "wval": 10},
    ],
	
	
    "links":[
        {"source":0,"target":8,"value":2.5},	
        {"source":0,"target":9,"value":2.5},
        {"source":0,"target":10,"value":2.5},
        {"source":0,"target":13,"value":2.5},
		
        {"source":1,"target":8,"value":2.5},
        {"source":1,"target":9,"value":2.5},
        {"source":1,"target":10,"value":2.5},
        {"source":1,"target":13,"value":2.5},
		
        {"source":2,"target":8,"value":2.5},
        {"source":2,"target":9,"value":2.5},
        {"source":2,"target":10,"value":2.5},
        {"source":2,"target":13,"value":2.5},
		
        {"source":3,"target":8,"value":2.5},
        {"source":3,"target":9,"value":2.5},
		
        {"source":4,"target":10,"value":2.5},
		
        {"source":5,"target":10,"value":2.5},
		
        {"source":6,"target":8,"value":2.5},
        {"source":6,"target":9,"value":2.5},
		{"source":6,"target":10,"value":2.5},
		
        {"source":7,"target":8,"value":2.5},
        {"source":7,"target":9,"value":2.5},
        {"source":7,"target":10,"value":2.5},
		
        {"source":8,"target":9,"value":2.5},
        {"source":8,"target":10,"value":2.5},
        {"source":8,"target":13,"value":2.5},
        {"source":8,"target":14,"value":2.5},
		
        {"source":9,"target":8,"value":2.5},
        {"source":9,"target":10,"value":2.5},
        {"source":9,"target":13,"value":2.5},
        {"source":9,"target":14,"value":2.5},
		
        {"source":10,"target":8,"value":2.5},
        {"source":10,"target":9,"value":2.5},
        {"source":10,"target":11,"value":2.5},
        {"source":10,"target":12,"value":2.5},
        {"source":10,"target":14,"value":2.5},

    ]
};
