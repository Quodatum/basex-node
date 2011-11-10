/*
 * This example shows error response
 *
 */
var basex = require("../index");
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
client.execute("create db database", basex.print);

//run query on database
client.execute("xquery 2+2", basex.print);
// run query on database
client.execute("xquery 2+", basex.print);

// drop database
client.execute("drop db database", basex.print);

// close session
client.close();