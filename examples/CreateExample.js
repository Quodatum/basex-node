/*
 * This example shows how new databases can be created.
 *
 */
var basex = require("../index");
basex.debug_mode = true;
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");

// create new database
client.create("database", "<x>Hello World!</x>", basex.print);

// run query on database
client.execute("xquery /", basex.print);

// drop database
client.execute("drop db database", basex.print);

// close session
client.close(basex.print);
