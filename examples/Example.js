
/*
 * This example shows how database commands can be executed.
 */
var basex  = require("../index");
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
basex.debug_mode = false;
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
	}
}; 
var t0=new Date();
client.execute("xquery 1 to 10",print);
client.close(function(){
	var t2=new Date();
	console.log("Closed in ",t2-t0," milliseconds.");	
});
var t1=new Date();
// not a true time because basex commands not yet done.
console.log("Commands send in ",t1-t0," milliseconds.");
