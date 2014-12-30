/*
 * This example shows how new documents can be added.
 *
 */
var basex = require("../index");
var log = require("../debug");
var fs = require("fs");

// create session
var client = new basex.Session();
basex.debug_mode = false;

// create new database
 client.execute("create db test_db", log.print);
 
// add document from stream
 var s=fs.createReadStream(__dirname+ "/books.xml"); 
client.add("/world/World.xml", s, log.print);

// drop database
client.execute("drop db test_db", log.print);

// close session
client.close();
