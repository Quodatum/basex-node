/* BaseX Node.js client
 * http://docs.basex.org/wiki/Server_Protocol
 * andy bunce 2011-2012
 */

// set this to true to enable console.log msgs for all connections
exports.debug_mode = false;

var net = require("net"), 
util = require("util"), 
events = require("events"), 
crypto = require("crypto"), 
assert = require('assert'), 
Query = require("./lib/query").Query, 
Watch = require("./lib/watch").Watch, 
parser = require("./lib/parser"),
Queue = require("./lib/queue").Queue;

var states = {
	DISCONNECTED : 0,
	CONNECTING : 1,
	AUTHORIZE : 2,
	CONNECTED : 3,
	CLOSING : 4
};

var tagid = 0; // used to give each BaseXStream a unique .tag property

var BaseXStream = function(host, port, username, password) {
	var self = this;
	this.port = port || 1984;
	this.host = host || "127.0.0.1";
	this.username = username || "admin";
	this.password = password || "admin";
	this.tag = "S" + (++tagid);
	this.commands_sent = 0;
	// reset
	this.reset = function() {
		this.state = states.DISCONNECTED;
		this.current_command = null; // waiting for response to this
		this.closefn = null;
		this.blocked = false; // can't send until reply
		this.buffer = "";
		this.q_pending = new Queue(); // holds commands to send
		this.q_sent = new Queue(); // holds commands sent
		// event stuff
		this.event = null;
		// initial parser for auth
		this.parser = function() {
			var timestamp = self.readline();
			self.send(self.username+"\0");
			var s = md5(md5(self.password) + timestamp);
			self.send(s+"\0");
		};
	};
	this.reset();

	var stream = net.createConnection(this.port, this.host);
	stream.setEncoding('utf-8');
	this.stream = stream;

	stream.on("connect", function() {
		self.state = states.CONNECTING;
		if (exports.debug_mode) {
			console.log(self.tag + ": stream connected");
		}
	});

	stream.on("data", function(reply) {
		self.buffer += reply;
		if (exports.debug_mode) {
			console.log(self.tag + "<<");
			console.dir(self.buffer);
		}

		if (self.state == states.CONNECTING) {
			self.parser();
			self.state = states.AUTHORIZE;
		} else if (self.state == states.AUTHORIZE) {
			if (!self.ok())
				throw "Access denied.";
			self.state = states.CONNECTED;
			if (exports.debug_mode) {
				console.log(self.tag + ": authorized");
			}
			self.emit("connect", 1);
			self.sendQueueItem();
		} else {
			var r;
			// console.log("parse");
			while (r = self.current_command.parser()) {
				if (exports.debug_mode) {
					console.log("response: ", r);
				}
				if (self.current_command.callback) {
					self.current_command.callback(r.ok ? null : r.info, r);
				}

				self.current_command = self.q_sent.shift();
				// assert.equal(self.buffer.length, 0, "buffer not empty:" +
				// self.buffer);
				if (!self.current_command) {
					break;
				}
			}
		}
	});

	stream.on("error",
					function(e) {
						if (e.code == 'ECONNREFUSED') {
							console
									.log('ECONNREFUSED: connection refused. Check BaseX server is running.');
						} else {
							console.log(e);
						}
					});

	stream.on("close", function() {
		if (exports.debug_mode) {
			console.log(self.tag + ": stream closed");
		}
		if (self.event) self.event.close()
		
		if (self.closefn) {
			self.closefn();
			self.closefn = null;
		}
		;
	});

	stream.on("end", function() {
		// console.log(self.tag+": stream end");
	});

	stream.on("drain", function() {
		// console.log("drain");
	});

	this.send = function(s) {
		if (typeof s === "function")
			s = s();

		if (exports.debug_mode) {
			console.log(self.tag + ">>");
			console.dir(s );
		}
		;
		self.stream.write(s );
		self.commands_sent += 1;
	};
	// read 1 character
	this.read = function() {
		// console.log("data", l, p, buffer + ":");
		var ip = self.buffer.substr(0, 1);
		self.buffer = self.buffer.substr(1);
		return ip;
	};
	this.ok = function() {
		return self.read() == "\0";
	};
	// read upto null
	this.readline = function() {
		var p = self.buffer.indexOf("\0");
		if (p == -1) {
			console.dir(self.current_command);
			console.dir(self.buffer);
			assert.notEqual(p, -1, "no null");
		}

		// console.log("data", l, p, buffer + ":");
		var ip = self.buffer.substring(0, p);
		self.buffer = self.buffer.substring(p + 1);
		return ip;
	};
	// standard parser read 2 lines and byte
	this.parser1 = function() {
		return parser.popmsg(self, [ "result", "info" ])
	};
	// read status byte
	this.parserOk = function() {
		return parser.popmsg(self, [])
	};

	// read line and byte
	this.parser2 = function() {
		if (-1 != self.buffer.indexOf("\0")) {
			// console.log(self.tag," parser2",self.current_command.send)
			// console.dir(self.buffer)
			var reply = self.readline();
			var ok = self.ok();
			var r = {
				ok : ok
			};
			if (ok) {
				r.result = reply
			} else {
				r.info = self.readline()
			}
			return r
		}

	};
	

	// add command and returns the result:
	this.execute = function(cmd, callback) {
		self.send_command({
			send : cmd+"\0",
			parser : self.parser1,
			callback : callback
		});
	};
	// Returns a query object for the specified query:
	this.query = function(query) {
		return new Query(self, query);
	};
	// Creates a database from an input stream:
	this.create = function(name, input, callback) {
		self.send_command({
			send : "\x08" + name + "\0" + input+"\0",
			parser : self.parser2,
			callback : callback
		});
	};
	// Adds a document to the current database from an input stream:
	this.add = function(path, input, callback) {
		self.send_command({
			send : "\x09" + path + "\0" + input+"\0",
			parser : self.parser2,
			callback : callback
		});
	};
	// Replaces a document with the specified input stream:
	this.replace = function(path, input, callback) {
		self.send_command({
			send : "\x0C" + path + "\0" + input+"\0",
			parser : self.parser2,
			callback : callback
		});
	};
	// Stores raw data at the specified path:
	this.store = function(path, input, callback) {
		self.send_command({
			send : "\x0D" + path + "\0" + input+"\0",
			parser : self.parser2,
			callback : callback
		});
	};
	// watch
	this.watch = function(name, notification, callback) {
		if (self.event == null) { //1st time 
			self.send_command({
				send : "\x0A", 
				parser : self.parsewatch,
				callback :function(){
					self.event.add(name, notification)
					self.send_command({
						send : name+"\0",
						parser : self.parsewatch2,
						callback : callback
					});
					}
				})
		} else {
			self.event.add(name, notification)
			self.send_command({
				send : "\x0A" +name+"\0",
				parser : self.parsewatch2,
				callback : callback
			});
		}
			
	};
	// parse 1st watch response
	this.parsewatch = function() {
		// expect port,id
		var flds = parser.popmsg(self, [ "eport", "id" ],false)
		if (flds) {
			// console.log(flds)
			// console.dir(parts)
			if (self.event == null) {
				self.event = new Watch(self.host, flds.eport,flds.id)
				self.event.on("connect",self.parser) //need to wait
			}
			flds.ok=true // expected by reader
			return flds;
		}
	};

	// parse other watch response
	this.parsewatch2 = function() {
		// wait info and connected
		if (self.event.isConnected) return parser.popmsg(self, [ "info" ])
	};
	
	// unwatch
	this.unwatch = function(name, callback) {	
		self.send_command({
			send : "\x0B" + name+"\0",
			parser : self.parser2,
			callback : function(){
				self.event.remove(name);
				callback
			}
		});
	};
	// end the session, sash callback, for stream end
	this.close = function(callback) {
		self.closefn = callback;
		self.send_command({
			send : "exit"+"\0",
			parser : self.parserOk
		// sometime get this, timing
		});
	};
	// -------end of commands ---------

	// 
	this.send_command = function(cmd) {
		self.q_pending.push(cmd);
		self.sendQueueItem();
	};
	// do the next queued command, if any, return true if sent
	this.sendQueueItem = function() {
		// console.log("queues waiting send: ",self.q_pending.length,", waiting
		// reply:",self.q_sent.length)

		if (self.q_pending.length == 0 || self.blocked
				|| self.state != states.CONNECTED)
			return false

		var cmd = self.q_pending.shift();
		if (!self.current_command) {
			self.current_command = cmd;
			// console.log("current command: ",cmd.send)

		} else {
			self.q_sent.push(cmd);
		}
		;

		// assert.equal(self.buffer.length, 0, "buffer not empty:" +
		// self.buffer);

		self.send(cmd.send);
		self.setBlock(cmd.blocking ? true : false);
		return true;
	};

	this.setBlock = function(state) {
		self.blocked = state;
		while (self.sendQueueItem()) {
		}
		;
	};
	events.EventEmitter.call(this);
};

function md5(str) {
	return crypto.createHash('md5').update(str).digest("hex");
};

util.inherits(BaseXStream, events.EventEmitter);
exports.Session = BaseXStream;
