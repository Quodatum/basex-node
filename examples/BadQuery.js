/*
 * This example shows error response
 *
 */
var basex = require("../index");
var log = require("../debug");
// create session
var session = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = false;
var invalid_query = '(map {"key": "value"})("missing")("key")';

var q = session.query("2+")
q.execute((e, r) => {
    console.log("Result: ", r.result, "; Error:", e)
})


// close session
session.close();