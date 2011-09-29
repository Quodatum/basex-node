// standalone basex test
var net = require("net")
, util = require("util")
, events = require("events")
, crypto = require("crypto")
, assert = require('assert')
, bstream =require("../lib/stream")
, port = 1984
, host = "127.0.0.1"
, options = {
	"username" : "admin",
	"password" : "admin"
};
var states = {
	DISCONNECTED : 0,
	CONNECTING : 1,
	AUTHORIZE : 2,
	CONNECTED : 3
};
var CHR0 = "\x00";

var state = states.DISCONNECTED;
var buffer = "";
console.log("login to basex server");

var s=new bstream.BaseXStream(port, host,options);
s.on("connected",function(err,res){console.log("ddddd")})
var stream = net.createConnection(port, host);
stream.setEncoding('utf-8');

stream.on("connect", function() {
	state = states.CONNECTING;
});

stream.on("data", function(reply) {
	console.dir(reply);
	buffer += reply;
	if (state == states.CONNECTING) {
		var ip=readline();
		send(options.username);
		var s = loginresponse(ip,  options.password);
		send(s);
		state = states.AUTHORIZE;
	} else if (state == states.AUTHORIZE) {
		var b=read().charCodeAt(0);;
		console.log("auth:", b);
		if(!0==b) throw "Failed to login";
		state = states.CONNECTED;
		//send("info");
		send("OPEN test");
		send("XQUERY 1 to 5");
	} else {
		var l=readline();
		console.log(">>",l);
	}
});

stream.on("error", function(msg) {
	console.log("error");
});

stream.on("close", function() {
	console.log("close");
});

stream.on("end", function() {
	console.log("end");
});

stream.on("drain", function() {
	console.log("drain");
});

function send(str){
	console.log(">>",str);
	stream.write(str+CHR0);
};

function query(xq){
	send(CHR0+xq);
};
function readline(){
	var p = buffer.indexOf(CHR0);
	assert.notEqual(p, -1, "no null");
	//console.log("data", l, p, buffer + ":");
	var ip = buffer.substring(0, p);
	buffer = buffer.substring(p + 1);
	return ip;
};
function read(){
	//console.log("data", l, p, buffer + ":");
	var ip = buffer.substr(0, 1);
	buffer = buffer.substr( 1);
	return ip;
};
// basex login response
function loginresponse(timestamp,  password) {
	// {username} {md5(md5(password) + timestamp)}
	var p1 = crypto.createHash('md5').update(password).digest("hex");
	var p2 = crypto.createHash('md5').update(p1 + timestamp).digest("hex");
	return  p2 ;
};
