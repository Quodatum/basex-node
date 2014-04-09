/*
 * This example shows how new documents can be added.
 *
 */
var basex = require("../index");
var log = require("../debug");
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
client.execute("create db test_db", log.print);

// add document
client.add("/world/World.xml", "<x>Hello World!</x>", log.print);

// add document
client.add("Universe.xml", "<x>Hello Universe!</x>", log.print);

// run query on database
client.execute("xquery /", log.print);

// drop database
client.execute("drop db test_db", log.print);

// close session
client.close();
