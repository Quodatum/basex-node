/*
 * This example shows how new documents can be added.
 *
 */
var basex = require("../index");
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
client.execute("create db database", basex.print);

// add document
client.add("World.xml", "/world", "<x>Hello World!</x>", basex.print);

// add document
client.add("Universe.xml", "", "<x>Hello Universe!</x>", basex.print);

// run query on database
client.execute("xquery /", basex.print);

// drop database
client.execute("drop db database", basex.print);

// close session
client.close();
