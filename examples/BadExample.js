/*
 * This example shows error response
 *
 */
var basex = require("../index");
var log = require("../debug");
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
client.execute("create db test_db", log.print);

//run query on database
client.execute("xquery 2+2", log.print);
// run query on database
client.execute("xquery 2+", log.print);

// drop database
client.execute("drop db test_db", log.print);

// close session
client.close();