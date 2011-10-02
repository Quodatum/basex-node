
/*
 * This example shows how external variables can be bound to XQuery expressions.
 */

var basex  = require("../index");
var session = basex.Session("localhost", 1984, "admin", "admin");

// create query instance
var input = "declare variable \$name external; for \$i in 1 to 10 return element { \$name } { \$i }";
var query = session.query(input);

// bind variable
query.bind("name", "number");

// print results
query->execute(basex.print);

// close query instance
query.close();

// close session
session.close();

