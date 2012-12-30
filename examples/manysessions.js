// start multiple sessions
// fails with around 200 sessions
var basex =require("../index");
var log = require("../debug");
basex.debug_mode = false;
var sCount=200; // max 200
var sessions=[];
//show supplied msg then basex server response
function track(msg) {
	return function(err, reply){
		sCount--;
		console.log("closed: ",msg, ", remaining: ",sCount);
		if(arguments.length==2) print(err, reply)
		}
};
for(i=0;i<sCount;i++){
	sessions.push(new basex.Session())	
};

sessions.map(function(s){return s.execute("xquery 1 to 10",log.printMsg(s.tag))})
sessions.map(function(s){return s.close(track(s.tag))})
//sessions.map(function(s){s.execute("xquery 1 to 10",log.printMsg(s.tag))})






