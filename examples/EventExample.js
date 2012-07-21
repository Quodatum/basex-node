/*
 * This example shows how to use the event feature.
 *
 */
var basex = require("../index");
var d = require("../debug");

// create sessions
var session1 = new basex.Session("localhost", 1984, "admin", "admin");
var session2 = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = false;



session1.execute("create event messenger",afterEvent);

function afterEvent(err, reply){
	if (err) console.log("Error: " + err);
	console.log("afterevent");
	session2.watch("messenger",watchCallback,afterWatch);	
};

function afterWatch(err, reply){
	if (err)console.log("Error: " + err);
	console.log("afterwatch");
	var xq="for $i in 1 to 10000000 where $i=0  return $i"
		session2.query(xq).execute(d.printMsg("S2:execute"));
		session1.query("db:event('messenger', 'Hello World!')").execute(d.printMsg("S1:event"));
};

function watchCallback(name,msg){
	console.log("watch update-----> ",msg)
	session2.unwatch("messenger",function(){
	session1.execute("drop event messenger",d.printMsg("S1:drop event"));
	// close session
	session1.close(d.printMsg("S1:close"));
	session2.close(d.printMsg("S2:close"));			
	});
    
};