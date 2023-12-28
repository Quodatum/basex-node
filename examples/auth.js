/*
 * This example has all session options explicitly set.
 */
var basex  = require("../index");
basex.debug_mode = false;
var client = new basex.Session("localhost", 8900,"admin","admin");

/**
 * Description
 * @method print
 * @param {} err
 * @param {} reply
 * @return 
 */
function print(err, reply) {
	if (err) {
		console.log("Error: " + err);
	} else {
		var t2=new Date();
		console.log("Execution completed in ",t2-t0," milliseconds.");
		console.dir(reply);
	}
}; 
var t0=new Date();
client.execute("xquery 1 to 10",print);
client.close(function(){
	var t2=new Date();
	console.log("Closed in ",t2-t0," milliseconds.");	
});
var t1=new Date();
// time to send commands to server.
console.log("Commands send in ",t1-t0," milliseconds.");
