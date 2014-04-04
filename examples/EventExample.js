/*
 * This example shows how to use the event feature.
 *
 */
var basex = require("../index");
var d = require("../debug");

// create sessions
var session1 = new basex.Session("localhost", 1984, "admin", "admin");
var session2 = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = false;

// create the event
session1.execute("create event test_evt", afterCreate);

// watch for it in second session
/**
 * Description
 * @method afterCreate
 * @param {} err
 * @param {} reply
 * @return 
 */
function afterCreate(err, reply) {
	console.log("running afterCreate...");
	if (err)
		console.log("Error: " + err);
	session2.watch("test_evt", watchCallback, afterWatch);
};

// run long query in sessions, and fire event from session1
/**
 * Description
 * @method afterWatch
 * @param {} err
 * @param {} reply
 * @return 
 */
function afterWatch(err, reply) {
	console.log("running afterWatch...");
	if (err)
		console.log("Error: " + err, reply);

	var xq = "for $i in 1 to 10000000 where $i=7  return $i"
	session2.query(xq).execute(d.printMsg("S2:execute complete"));
	session1.query("db:event('test_evt', 'Hello World!')").execute(
			d.printMsg("S1:event sent"));
};

// on event received show and unwatch
/**
 * Description
 * @method watchCallback
 * @param {} name
 * @param {} msg
 * @return 
 */
function watchCallback(name, msg) {
	console.log("watch event received-----> ", msg)
	session2.unwatch("test_evt", teardown);
};
// close all
/**
 * Description
 * @method teardown
 * @param {} err
 * @param {} reply
 * @return 
 */
function teardown(err, reply) {
	console.log("unwatch:", err, reply)
	session1.execute("drop event test_evt", d.printMsg("S1:drop event"));
	// close session
	session1.close(d.printMsg("S1:close"));
	session2.close(d.printMsg("S2:close"));
};