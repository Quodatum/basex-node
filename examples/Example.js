
/*
 * This example shows how database commands can be executed.
 */
var basex  = require("../index");
var client = new basex.Session();
basex.debug_mode = false;
function print(err, reply) {
	if (err) {
		console.log("Error: " + err);
	} else {
		var t2=new Date();
		console.log("Commands completed in ",t2-t0," milliseconds.");
	}
}; 
var t0=new Date();
client.execute("xquery 1 to 10",basex.print);
client.close(print);
var t1=new Date();
// not a true time because basex commands not yet done.
console.log("Commands send in ",t1-t0," milliseconds.");
