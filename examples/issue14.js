/*
 * This example shows an invalid document being added.
 *
 */
var basex = require("../index");
var log = require("../debug");
// create session
var client = new basex.Session();
basex.debug_mode = true;
// create new database
client.execute("create db test_db", log.print);

// add document
for (var i=0;i<50;i++){

client.add("/world/World.xml", "<\"x\">Hello World!</x>", log.print);
};


// drop database
client.execute("drop db test_db", log.print);
// close session
client.close();
