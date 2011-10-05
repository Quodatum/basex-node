
/*
 * This example shows how database commands can be executed.
 */
var basex  = require("../index");
var client = new basex.Session();
function print(err, reply) {
	if (err) {
		console.log("Error: " + err);
	} else {
		console.dir(reply);
		var t2=new Date();
		console.log("At close milliseconds:",t2-t0);
	}
}; 
var t0=new Date();
client.execute("xquery 1 to 10",basex.print);
client.close(print);
var t1=new Date();
// not a true time because basex commands not yet done.
console.log("milliseconds:",t1-t0);
