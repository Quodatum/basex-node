/*
 * This example shows the use of binary data .
 */
var basex  = require("../index");
var client = new basex.Session();
basex.debug_mode = true;

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
            console.log("Reply: ",reply);
            var str = reply.result;
            var buf = new Buffer(str.length);

            for (var i = 0; i < str.length ; i++) {
              buf[i] = str.charCodeAt(i);
            }

            console.log(buf);
    }
};
//var xq="let $av:= (0 to 255)!xs:unsignedByte(.)" +
var xq="let $av:=(0 to 127,-127 to -1)!xs:byte(.)" +
	   " return convert:bytes-to-base64($av)";

client.execute("xquery declare option output:method 'raw';"+xq,print);
client.close();