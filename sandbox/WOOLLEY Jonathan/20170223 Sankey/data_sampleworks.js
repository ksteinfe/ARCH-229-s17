
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
        {"name":"A(+)", "category":"foo", "wval": 20}, //0
        {"name":"B(-)", "category":"bar", "wval": 20}, //1
        {"name":"C", "category":"qux", "wval": 20},
		
		{"name":"D", "category":"foo", "wval": 20},
        {"name":"E", "category":"bar", "wval": 20},
        {"name":"F", "category":"qux", "wval": 20},
    ],
    "links":[
        {"source":0,"target":2,"value":70},
        {"source":0,"target":3,"value":80},
		{"source":1,"target":2,"value":90},
		{"source":1,"target":3,"value":100},
		
		{"source":2,"target":4,"value":25},
		{"source":2,"target":3,"value":10},
		
        {"source":2,"target":5,"value":30},
		{"source":3,"target":4,"value":40},
        {"source":3,"target":5,"value":50},

    ]
};
