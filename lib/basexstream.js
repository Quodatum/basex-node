/*
 * Send and receive streams for BaseX. They expect and emit Buffers
 * 
 * andy bunce 2011-2014
 * see http://loose-bits.com/2012/08/02/nodejs-read-write-streams-pipes.html
 */
 

/**
 * SendStream: write 0xFF before 00 or FF
 * @constructor SendStream
 * @return 
 */
var SendStream = function() {
	this.readable = true;
	this.writable = true;
};
require("util").inherits(SendStream, require("stream"));

SendStream.prototype._transform = function(data) {
	var lastpos=0;
	// write 0xFF before 00 or FF
    var ef=new Buffer([255])
	for ( var i = 0; i < data.length; i++) {

		var c = data[i]
		if (c == 0 || c == 255 ) {
           if(i>lastpos) this.emit("data", data.slice(lastpos, i-1));
           this.emit("data", ef);
           lastpos=i;
        }
	}
	//  emit remaining data.
	if(data.length>lastpos) this.emit("data", data.slice(lastpos));
};

/**
 * Stream write (override).
 * @method write
 * @return 
 */
SendStream.prototype.write = function() {
	this._transform.apply(this, arguments);
};

/**
 * Stream end (override).
 * @method end
 * @return 
 */
SendStream.prototype.end = function() {
	this._transform.apply(this, arguments);
	this.emit("end");
};


/**
 * ReceiveStream: read next byte if 0xFF is received
 * @constructor ReceiveStream
 * @return 
 */
var ReceiveStream = function() {
	this.readable = true;
	this.writable = true;
	this.ff=false; // true when ff received
};
require("util").inherits(ReceiveStream, require("stream"));

ReceiveStream.prototype._transform = function(data) {
	if(!data)return
	var lastpos=0;
	// read next byte if 0xFF is received
	for ( var i = 0; i < data.length; i++) {
		var c = data[i]
        if(this.ff){
        	this.ff=false;
        }else if(c==0 ){
			if(i>lastpos) this.emit("data", data.slice(lastpos, i));
			this.emit("marker"); //got \0 eom
			lastpos=i+1;
		}else if(c==255){
			this.ff=true;
            if(i>lastpos) this.emit("data", data.slice(lastpos, i));
            lastpos=i 
		}
	}
	//  emit remaining.
	if(data.length>lastpos) this.emit("data", data.slice(lastpos));
};

/**
 * Stream write (override).
 * @method write
 * @return 
 */
ReceiveStream.prototype.write = function() {
	this._transform.apply(this, arguments);
};

/**
 * Stream end (override).
 * @method end
 * @return 
 */
ReceiveStream.prototype.end = function() {
	this._transform.apply(this, arguments);
	this.emit("end");
};


/**
 * pass thru, does nothing
 * @constructor NopStream
 * @return 
 */
var NopStream = function () {
  this.readable = true;
  this.writable = true;
};
// Inherit from base stream class.
require('util').inherits(NopStream, require('stream'));

// Extract args to `write` and emit as `data` event.
/**
 * Description
 * @method write
 * @return 
 */
NopStream.prototype.write = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  this.emit.apply(this, ['data'].concat(args))
};

// Extract args to `end` and emit as `end` event.
/**
 * Description
 * @method end
 * @return 
 */
NopStream.prototype.end = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  this.emit.apply(this, ['end'].concat(args))
};


//-----------------------------------------------
exports.NopStream = NopStream;
exports.SendStream = SendStream;
exports.ReceiveStream = ReceiveStream;