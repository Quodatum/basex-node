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
var xq="<foo a='45'><goo>some text</goo></foo>";
client.execute("SET SERIALIZER method=jsonml",basex.print);
client.execute("XQUERY "+xq,print);
client.close();