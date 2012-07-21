/* BaseX Node.js client watch event handler
 * http://docs.basex.org/wiki/Server_Protocol
 * andy bunce 2011-2012
 */
var parser = require("./parser"),
util = require("util"), 
events = require("events"),
net = require("net");

exports.debug_mode = false;

function Watch(host,port,id ) {
	//console.log("Watch:",host,port,id)
	this.isConnected=false;
	this.stream = null;
	this.en = {};// names to notifiers
	this.buffer = "";
	var self = this;

	this.add=function(name, callback){
		this.en[name] = callback
	};

	this.remove=function(name){
		delete this.en[name]
	};
    
	this.close=function(){
		if(self.stream) {
			// console.log(self.tag+": event stream closing");
			self.stream.destroySoon();
			self.stream = null;
		}
	};
	
	this.parse = function() { // intial \0 from event
		var r = parser.popmsg(self, [])
		if (!r.ok)
			throw "Bad event protocol";
		this.isConnected=true;
		self.parse = self.parseEvent;
		self.emit("connect", 1);		
	};

	// watch response
	this.parseEvent = function() {
		var r = parser.popmsg(self, [ "name", "msg" ], false)
		if (r) {
			var f = self.en[r.name];
			f(r.name, r.msg)
		}
	};

	var stream = net.createConnection(port, host);
	stream.setEncoding('utf-8');
	stream.on("data", function(reply) {
		if (exports.debug_mode) {
			console.log("event<<");
			console.dir(reply);
		}
		;
		self.buffer += reply;
		self.parse()
	});

	stream.on("connect", function() {
		if (exports.debug_mode) {
			console.log("event connect")
		};
		stream.write(id + "\0");
	});
	
	stream.on("error", function() {
		console.log("event error")
	})
	this.stream = stream;
};

util.inherits(Watch, events.EventEmitter);
exports.Watch = Watch;