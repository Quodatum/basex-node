/* BaseX Node.js client parser
 * http://docs.basex.org/wiki/Server_Protocol
 * andy bunce 2011-2012
 * 
 * parse incoming messages from basex server
 */
exports.debug_mode = false;
var BaseXStream = require("./basexstream"),
util = require("util"), 
events = require("events");

// @param stream socket stream
/**
 * reads from i/p stream from basex server and generates events from the protocol
 * @method parse
 * @param {} stream
 * @return 
 */
var parse = function(stream) {
	var self=this;
	var r=new BaseXStream.ReceiveStream();

	r.on("marker",function(){
		self.data.push(self.buffer);
		//console.log("XX",self.data.length)
		self.buffer="";
		});
	r.on("data",function(data){
		self.buffer+=data;
		self.emit("data",data) // not currently used
		});
	stream.pipe(r);
	this.receive=r;

	this.data=[];
	this.popStatus=false;
	this.buffer="";
	/**
	 * take fields named in array flds delimited by \0 from buffer
	 * @method need
	 * @param {} flds
	 * @param {} popStatus boolean if true read 1byte status 0/1 into ok:
	 * @return object or empty if message  not fully present in buffer. 
	 */
	this.need=function(flds,popStatus){
		if(self.data.length<flds.length)return;
		if(popStatus && this.buffer=="" && self.data.length==flds.length) return;
		var result={};
		while ( flds.length) {
			result[flds.shift()] = self.data.shift()
		}
		if(popStatus){
			var r=self.popByte()
			result.ok=r.data=="\0";
	    }
		return result;
	};

	/**
	 * get a byte or nothing
	 * @method popByte
	 * @return object {data:byte} or null
	 */
	this.popByte=function(){
		if(self.data.length){
				var s=self.data.shift()
                if(s.length==0){ 
                	return {data:"\0"}
                }else{
                	self.data.unshift(s.substring(1))
                	return {data:s[0]}
		        }
	    }else if (self.buffer.length) {
	        var s = self.buffer;
	        self.buffer = s.substring(1)
	        return {data: s[0]};
	    }
	    else {
	        return null;
	    }	
	};
};
util.inherits(parse, events.EventEmitter);
exports.parse = parse;