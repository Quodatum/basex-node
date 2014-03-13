/*
 * This example shows how new databases can be created.
 *
 */
var basex = require("../index");
var log = require("../debug");
basex.debug_mode = true;
// create session
var client = new basex.Session("localhost", 1984, "admin", "admin");
  
// create new database
client.execute("create database gumby", log.print);
client.add("people.xml","<people><person>Gumby\nman</person><something>else</something><person>Pokey\nhorse</person></people>",log.print);
// run query on database
  
var query = client.query("//bad");
query.results(log.print);
// close session
client.close();