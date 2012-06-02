
/*
 * This example shows how queries can be executed in an iterative manner.
 * Iterative evaluation will be slower, as more server requests are performed.
 *
 */
var basex  = require("../index");
var log = require("../debug");
basex.debug_mode = false;
  // create session
var session = new basex.Session("localhost", 1984, "admin", "admin");

// create query instance
var input = 'for $i in 1 to 10 return <xml>Text { $i }</xml>';
var query = session.query(input);

query.results(log.print);
//query.info(basex.print);
//query.options(basex.print);
// loop through all results
//while(query.more()) {
//  console.log(query->next());
//}

// close query instance
query.close();

// close session
session.close();

