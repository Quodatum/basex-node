// basex client commands

var CHR0 = "\x00";
var Cmds = function(stream) {
	this.stream = stream;
	var self = this;
	this.send = function(str) {
		console.log(">>>", str);
		self.stream.write(str + CHR0);
	};
};
Cmds.prototype.execute = function(cmd) {
	this.send(cmd);
};
Cmds.prototype.query = function(query) {
	this.send(CHR0+query);
	throw "no query";
};

Cmds.prototype.create = function(name, input) {
	this.send("\x08" + name);
	this.send(input);
};

Cmds.prototype.add = function(name, target, input) {
	this.send("\x09" + name);
	this.send(target);
	this.send(input);
};

Cmds.prototype.replace = function(path, input) {
	this.send("\x0C" + path);
	this.send(input);
};

Cmds.prototype.store = function(path, input) {
	this.send("\x0D" + path);
	this.send(input);
};
Cmds.prototype.close = function() {
	this.send("exit");
};
exports.Cmds = Cmds;
