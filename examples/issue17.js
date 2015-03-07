/*
 * This example shows how new databases can be created.
 *
 */
var basex = require("../index");
var log = require("../debug");

// create session
var session = new basex.Session("localhost", 1984, "admin", "admin");
//create new database
//session.create("test_db", "<x>Hello World!</x>", log.print);
basex.debug_mode = false;  
var query=session.query('/Meeting/Races/Race/RaceEntries/RaceEntry/Form/ResultsSummaries/ResultsSummary/@Wins>=1')
query.results(log.print);
console.log(session);
session.close()
