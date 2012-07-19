/*
 * This example shows the use of binary data .
 */
var basex  = require("../index");
var client = new basex.Session();
basex.debug_mode = true;

function print(err, reply) {
    if (err) {
            console.log("Error: " + err);
    } else {
            console.log(reply);
    }
};
var xq="let $av:= (0 to 127,-128 to -1)!xs:byte(.)" +
	   " return convert:bytes-to-hex($av)";
client.execute("xquery declare option output:method 'raw';"+xq,print);
client.close();