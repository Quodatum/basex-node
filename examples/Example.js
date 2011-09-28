
/*
 * This example shows how database commands can be executed.

 */
var basex  = require("../index");
var client = basex.createClient();
var t0=new Date();
client.execute("xquery 1 to 10",basex.print);
client.close(basex.print);
var t1=new Date();
console.log("milliseconds:",t1-t0);
