/*
 * Send and receive streams for BaseX
 * SendStream: write 0xFF before 00 or FF
 * ReceiveStream: read next byte if 0xFF is received
 * andy bunce 2011-2012
 * see http://loose-bits.com/2012/08/02/nodejs-read-write-streams-pipes.html
 */

var SendStream = function() {
	this.readable = true;
	this.writable = true;
};

require("util").inherits(SendStream, require("stream"));

/**
 * 
 */
SendStream.prototype._transform = function(data) {
	// Here, we'll just shortcut to a string.
	console.log("dddddddddddddd")
	data = data ? data.toString() : "";
	var d2 = "";
	// write 0xFF before 00 or FF
	for ( var i = 0; i < data.length; i++) {

		var c = data.charAt(i)
		if (c == "\x00" || c == "\xFF" ) d2+="\xFF"
		d2 += c
	}
	//  emit data event with transformed data.
	this.emit("data", d2);
};

/**
 * Stream write (override).
 */
SendStream.prototype.write = function() {
	this._transform.apply(this, arguments);
};

/**
 * Stream end (override).
 */
SendStream.prototype.end = function() {
	this._transform.apply(this, arguments);
	this.emit("end");
};
// -----------------------------------
var ReceiveStream = function() {
	this.readable = true;
	this.writable = true;
	this.ff=false; // true when ff received
};

require("util").inherits(ReceiveStream, require("stream"));

ReceiveStream.prototype._transform = function(data) {
	// Here, we'll just shortcut to a string.
	data = data ? data.toString() : "";
	var d2 = "";
	// read next byte if 0xFF is received
	for ( var i = 0; i < data.length; i++) {

		var c = data.charAt(i)
		if(c=="\x00" && ! this.ff){
			if(d2.length) this.emit("data", d2);
			this.emit("marker"); //got \0 eom
			d2=""
		}else if(c=="\xFF"){
			this.ff=true;
		}else{
			d2 += c;
			this.ff=false;
		}
	}
	//  emit data event with transformed data.
	if(d2.length) this.emit("data", d2);
};

/**
 * Stream write (override).
 */
ReceiveStream.prototype.write = function() {
	this._transform.apply(this, arguments);
};

/**
 * Stream end (override).
 */
ReceiveStream.prototype.end = function() {
	this._transform.apply(this, arguments);
	this.emit("end");
};
exports.SendStream = SendStream;
exports.ReceiveStream = ReceiveStream;