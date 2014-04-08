/*
 * This example shows how new documents can be added.
 *
 */
var basex = require("../index");
var log = require("../debug");
var fs = require("fs");

// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
// create new database
 client.execute("open database", log.print);
 //var s=fs.createReadStream(__dirname+ "\\books.xml");
 var s=fs.createReadStream("C:\\Program Files (x86)\\basex\\webapp\\xmark\\xmark\\auction.xml");

// add document
client.add("/world/World.xml", s, log.print);

// drop database
//client.execute("drop db database", log.print);

// close session
client.close();
