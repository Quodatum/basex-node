
/*
 * This example shows how queries can be executed in an iterative manner.
 * Iterative evaluation will be slower, as more server requests are performed.
 *
 */
var basex  = require("../index");
var log = require("../debug");

// create session
var session = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = false;
// create query instance
var input = 'for $i in 1 to 100 return <xml>Text { $i }</xml>';
var query = session.query(input);

query.results(log.print);

// close query instance
query.close();

// close session
session.close();

