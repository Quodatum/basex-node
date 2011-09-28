/*global Buffer require exports console setTimeout */

var net = require("net")
, util = require("util")
, Queue = require("./lib/queue").Queue
, events = require("events")
, crypto = require("crypto")
, parsers = []
, default_port = 1984
, default_host = "127.0.0.1"
, default_options = {
	"username" : "admin",
	"password" : "admin"
};
var CHR0 = "\x00";
// can set this to true to enable for all connections
exports.debug_mode = false;

parsers.push(require("./lib/parser/javascript"));

function to_array(args) {
	var len = args.length, arr = new Array(len), i;

	for (i = 0; i < len; i += 1) {
		arr[i] = args[i];
	}

	return arr;
}

function BasexClient(stream, options) {
	this.stream = stream;
	this.options = options || {};

	this.ready = false;
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
	this.monitoring = false;
	this.closing = false;
	this.server_info = {};
    this.states = {  
	            DISCONNECTED: 0
	            ,CONNECTING: 1
	            ,AUTHORIZE:2
	            ,CONNECTED:3
	        };
	        
	this.state = this.states.DISCONNECTED;

	var parser_module, self = this;

	if (exports.debug_mode) {
		console.log("Using default parser module: " + parsers[0].name);
	}
	parser_module = parsers[0];

	parser_module.debug_mode = exports.debug_mode;
	this.reply_parser = new parser_module.Parser({
		return_buffers : self.options.return_buffers || false
	});

	// "reply error" is an error sent back by basex
	this.reply_parser.on("reply error", function(reply) {
		self.return_error(new Error(reply));
	});
	this.reply_parser.on("reply", function(reply) {
		self.return_reply(reply);
	});
	// "error" is bad. Somehow the parser got confused. It'll try to reset and
	// continue.
	this.reply_parser.on("error",
			function(err) {
				self.emit("error", new Error("basex reply parser error: "
						+ err.stack));
			});

	this.stream.on("connect", function() {
		self.on_connect();
	});

	this.stream.on("data", function(buffer_from_socket) {
		self.on_data(buffer_from_socket);
	});

	this.stream.on("error", function(msg) {
		if (this.closing) {
			return;
		}

		var message = "basex connection to " + self.host + ":" + self.port
				+ " failed - " + msg.message;

		if (exports.debug_mode) {
			console.warn(message);
		}
		self.offline_queue.forEach(function(args) {
			if (typeof args[2] === "function") {
				args[2](message);
			}
		});
		self.offline_queue = new Queue();

		self.command_queue.forEach(function(args) {
			if (typeof args[2] === "function") {
				args[2](message);
			}
		});
		self.command_queue = new Queue();

		self.state = false;
		self.ready = false;
		self.emit("error", new Error(message));
	});

	this.stream.on("close", function() {
		self.connection_gone("close");
	});

	this.stream.on("end", function() {
		self.connection_gone("end");
	});

	this.stream.on("drain", function() {
		self.emit("drain");
	});

	events.EventEmitter.call(this);
}
util.inherits(BasexClient, events.EventEmitter);
exports.BasexClient = BasexClient;

BasexClient.prototype.on_connect = function() {
	console.log("onconnect -apb");
	if (exports.debug_mode) {
		console.log("Stream connected " + this.host + ":" + this.port + " fd "
				+ this.stream.fd);
	}
	var self = this;
	this.state=this.states.CONNECTING;

	this.ready = false;
	this.connections += 1;
	this.command_queue = new Queue();
	this.emitted_end = false;
	this.retry_timer = null;
	this.retry_delay = 250;
	this.stream.setNoDelay();
	this.stream.setTimeout(0);	
};


BasexClient.prototype.send_offline_queue = function() {
	var command_obj;
	while (this.offline_queue.length > 0) {
		command_obj = this.offline_queue.shift();
		if (exports.debug_mode) {
			console.log("Sending offline command: " + command_obj.command);
		}
		this.send_command(command_obj.command, command_obj.args,
				command_obj.callback);
	}
	this.offline_queue = new Queue();
	// Even though items were shifted off, Queue backing store still uses memory
	// until next add
};

BasexClient.prototype.connection_gone = function(why) {
	var self = this;

	// If a retry is already in progress, just let that happen
	if (self.retry_timer) {
		return;
	}

	// Note that this may trigger another "close" or "end" event
	self.stream.destroy();

	if (exports.debug_mode) {
		console.warn("basex connection is gone from " + why + " event.");
	}
	self.state=self.states.DISCONNECTED;
	self.ready = false;
	self.subscriptions = false;
	self.monitoring = false;

	// since we are collapsing end and close, users don't expect to be called
	// twice
	if (!self.emitted_end) {
		self.emit("end");
		self.emitted_end = true;
	}

	self.command_queue.forEach(function(args) {
		if (typeof args[2] === "function") {
			args[2]("Server connection closed");
		}
	});
	self.command_queue = new Queue();

	// If this is a requested shutdown, then don't retry
	if (self.closing) {
		self.retry_timer = null;
		return;
	}

	if (exports.debug_mode) {
		console.log("Retry connection in " + self.retry_delay + " ms");
	}
	self.attempts += 1;
	self.emit("reconnecting", {
		delay : self.retry_delay,
		attempt : self.attempts
	});
	self.retry_timer = setTimeout(function() {
		if (exports.debug_mode) {
			console.log("Retrying connection...");
		}
		self.retry_delay = self.retry_delay * self.retry_backoff;
		self.stream.connect(self.port, self.host);
		self.retry_timer = null;
	}, self.retry_delay);
};

BasexClient.prototype.on_data = function(data) {
	if (exports.debug_mode) {
		console.log("net read " + this.host + ":" + this.port + " fd "
				+ this.stream.fd + ": " + data.toString());
	}

	try {
		this.reply_parser.execute(data);
	} catch (err) {
		// This is an unexpected parser problem, an exception that came from the
		// parser code itself.
		// Parser should emit "error" events if it notices things are out of
		// whack.
		// Callbacks that throw exceptions will land in return_reply(), below.
		// TODO - it might be nice to have a different "error" event for
		// different types of errors
		this.emit("error", err);
	}
};
BasexClient.prototype.return_reply=function(reply){
	if(this.state==this.states.CONNECTING){
		this.send(options.username);
		var s=loginresponse(reply , this.options.password);
		this.state = this.states.AUTHORIZE;
		this.send(s);
		console.log("BasexClient.prototype.return_reply",s);
	}else if (this.state==this.states.AUTHORIZE){
		console.log("auth:",reply,"::");
	}
};
BasexClient.prototype.send=function(str){
	console.log(">>",str);
	stream.write(str+CHR0);
};

BasexClient.prototype.end = function() {
	this.stream._events = {};
	this.state=this.states.DISCONNECTED;
	this.ready = false;
	return this.stream.end();
};

exports.createClient = function(port_arg, host_arg, options_arg) {
	var port = port_arg || default_port, host = host_arg || default_host, options = options_arg
			|| default_options, basex_client, net_client;

	net_client = net.createConnection(port, host);
	net_client.setEncoding('utf-8')
	basex_client = new BasexClient(net_client, options);

	basex_client.port = port;
	basex_client.host = host;

	return basex_client;
};

// debug util
function print(err, reply) {
	if (err) {
		console.log("Error: " + err);
	} else {
		console.log("Reply: " + reply);
	}
};
exports.print = print;

//basex login response
function loginresponse(timestamp,  password) {
	// {username} {md5(md5(password) + timestamp)}
	var p1 = crypto.createHash('md5').update(password).digest("hex");
	var p2 = crypto.createHash('md5').update(p1 + timestamp).digest("hex");
	return  p2 ;
};

exports.loginresponse = loginresponse;