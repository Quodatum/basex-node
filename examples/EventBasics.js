/*
 * This example runs through event commands.
 * but does nothing useful
 */
var basex = require("../index");
var d = require("../debug");


// create session
var session1 = new basex.Session("localhost", 1984, "admin", "admin");

basex.debug_mode = true;
session1.execute("create event testevent",d.printMsg("S1:create event"));
session1.watch("testevent",watchCallback,d.printMsg("S1:watch"));
session1.unwatch("testevent",d.print);
session1.execute("drop event testevent",d.printMsg("S1:drop event"));
session1.close(d.print);

/**
 * Description
 * @method watchCallback
 * @param {} name
 * @param {} msg
 * @return 
 */
function watchCallback(name,msg){
	console.log("watch update-----> ",msg)
};