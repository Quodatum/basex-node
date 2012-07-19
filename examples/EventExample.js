/*
 * This example shows how to use the event feature.
 *
 */
var basex = require("../index");
var d = require("../debug");

// create sessions
var session1 = new basex.Session("localhost", 1984, "admin", "admin");
var session2 = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;

function watchCallback(name,msg){
	console.log("watch update-----> ",msg)
	session2.unwatch("messenger",function(){
		session1.execute("drop event messenger",d.printMsg("S1:drop event"));
		// close session
		session1.close(d.printMsg("S1:close"));
		session2.close(d.printMsg("S2:close"));			
	});
    
};

function afterEvent(err, reply){
	if (err) {
		console.log("Error: " + err);
		//return;
	}
	console.dir(reply);
	session2.watch("messenger",watchCallback,d.printMsg("S2:watching messenger"));
	var xq="for $i in 1 to 1000000 where $i=3  return $i"
	session2.query(xq).execute(d.printMsg("S2:execute"));
	session1.query("db:event('messenger', 'Hello World!')").execute(d.printMsg("S1:event"));

};

session1.execute("create event messenger",afterEvent);

