// baseXclient

// can set this to true to enable for all connections
exports.debug_mode = false;

var net = require("net")
, util = require("util")
, events = require("events")
, crypto = require("crypto")
, assert = require('assert')
, Queue = require("./lib/queue").Queue
;

var states = {
	DISCONNECTED : 0,
	CONNECTING : 1,
	AUTHORIZE : 2,
	CONNECTED : 3,
	CLOSING:4
};
var options = {};
var CHR0 = "\x00";


var BaseXStream = function(port, host, username,password) {
	this.port=port||1984;
	this.host=host||"127.0.0.1";
	this.username=username||"admin";
	this.password=password||"admin";
	this.connections = 0;
	this.attempts = 1;
	this.command_queue = new Queue(); // holds sent commands to de-pipeline
	// them
	this.offline_queue = new Queue(); // holds commands issued but not able to
	// be sent
	this.commands_sent = 0;
	this.retry_delay = 250;
	this.retry_backoff = 1.7;
	this.subscriptions = false;
	
	var stream;
	try{
		stream = net.createConnection(this.port, this.host);
		stream.setEncoding('utf-8');
	}catch(e){
		throw "Failed to connect to server"
	};
	this.stream = stream;
	this.state = states.DISCONNECTED;
	this.buffer="";
	events.EventEmitter.call(this);
	var self = this;
	stream.on("connect", function() {
		self.state = states.CONNECTING;
	});

	stream.on("data", function(reply) {	
		self.buffer += reply;
		if (exports.debug_mode) {
			console.dir(self.buffer);
		};	
		if (self.state == states.CONNECTING) {
			var timestamp = self.readline();
			self.send(self.username);
			var s = loginresponse(timestamp, self.password);
			self.send(s);
			self.state = states.AUTHORIZE;
		} else if (self.state == states.AUTHORIZE) {
			if (!0 == self.read().charCodeAt(0))
				throw "Failed to login";
			self.state = states.CONNECTED;
			self.emit("connected", 1);
		} else {
			if(-1!=self.buffer.indexOf(CHR0)){
				var reply = {
						result:self.readline(),
						info:self.readline()};
				self.read();
				self.emit("reply", reply);
			};
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
	this.send = function(str) {
		if (exports.debug_mode) {
			console.log(">>", str);
		};	
		self.stream.write(str + CHR0);
	};
	// read 1 character
	this.read=function(){
		// console.log("data", l, p, buffer + ":");
		var ip = self.buffer.substr(0, 1);
		self.buffer = self.buffer.substr(1);
		return ip;
	};
	// read upto null
	this.readline=function(){
		var p = self.buffer.indexOf(CHR0);
		assert.notEqual(p, -1, "no null");
		// console.log("data", l, p, buffer + ":");
		var ip = self.buffer.substring(0, p);
		self.buffer = self.buffer.substring(p + 1);
		return ip;
	};
	
	this.close = function() {
		//console.log("close");
		this.send("exit");
		this.stream.end();
	};
};


// basex login response
function loginresponse(timestamp, password) {
	// {username} {md5(md5(password) + timestamp)}
	var p1 = crypto.createHash('md5').update(password).digest("hex");
	var p2 = crypto.createHash('md5').update(p1 + timestamp).digest("hex");
	return p2;
};

function md5(str){
	return crypto.createHash('md5').update(str).digest("hex");
};

util.inherits(BaseXStream, events.EventEmitter);
exports.BaseXStream = BaseXStream;