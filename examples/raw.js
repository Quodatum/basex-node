/*
 * This example shows the use of raw data.  
 */
var basex  = require("../index");
var client = new basex.Session();
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
                console.log(reply);
        }
};

var xq="declare option output:method 'raw'; file:read-binary('"+__dirname+"/redsq.png')";

client.execute("XQUERY "+xq,print);
client.close();