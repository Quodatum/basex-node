/*
 * This example shows how to use the event feature.
 *
 */
var basex = require("../index");
var d = require("../debug");
var step = require('step');

// create sessions
var session1 = new basex.Session("localhost", 1984, "admin", "admin");
var session2 = new basex.Session("localhost", 1984, "admin", "admin");
basex.debug_mode = true;
step(
//		function() {
//	session1.execute("create event messenger", this)
//}, 
function() {
	session2.watch("messenger", watchCallback, this)
}, function() {
	session1.execute("XQUERY db:event('messenger', 99)", this);
});

/**
 * Description
 * @method watchCallback
 * @param {} name
 * @param {} msg
 * @return 
 */
function watchCallback(name, msg) {
	console.log("watch update-----> ", msg)
	step(
   function() {
    	session2.unwatch("messenger", this);
	}, 
	function() {
		session1.close(this);
	}, function() {
		session2.close(this);
	});
};

