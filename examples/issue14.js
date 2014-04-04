/*
 * This example shows an invalid document being added.
 *
 */
var basex = require("../index");
var log = require("../debug");
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
client.execute("create db database", log.print);

// add document
client.add("/world/World.xml", "<\"x\">Hello World!</x>", log.print);


// drop database
client.execute("drop db database", log.print);

// close session
client.close();
