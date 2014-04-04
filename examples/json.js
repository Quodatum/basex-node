/*
 * This example shows how JSON can be returned.
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
                var json=JSON.parse(reply.result);
                console.log("JSON:",json);
        }
};
var xq="db:system()";
client.execute("xquery declare option output:method 'jsonml';"+xq,print);
client.close();