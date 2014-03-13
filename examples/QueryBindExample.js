
/*
 * This example shows how external variables can be bound to XQuery expressions.
 */

var basex  = require("../index");
var log = require("../debug");
//basex.debug_mode = true;
var session = new basex.Session("localhost", 1984, "admin", "admin");

// create query instance
var input = "declare variable $name external; for $i in 1 to 1000 return element { $name } { $i }";
var query = session.query(input);

// bind variable
query.bind("name", "nodex","",log.print);
query.info(log.print);
// print results
query.execute(log.print);



// close query instance
query.close();

// close session
session.close();

