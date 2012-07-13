/* BaseX Node.js client query handler
 * http://docs.basex.org/wiki/Server_Protocol
* andy bunce 2011-2012
*/
function Query(session, query) {
	this.session = session;
	this.query = query;
	this.id = null;
	var self = this;

	this.close = function(callback) {
		self.session.send_command({
			send : function() { // send is function as needs id
				return "\x02" + self.id +"\0"
			},
			parser : self.session.parser2,
			callback : callback
		});
	};

	this.bind = function(name, value, type, callback) {
		var type = "";
		self.session.send_command({
			send : function() {
				return "\x03" + self.id + "\0" + name + "\0" + value
						+ "\0" + type +"\0"
			},
			parser : self.session.parser2,
			callback : callback
		});

	};

	this.results = function(callback) {
		self.session.send_command({
			send : function() {
				return "\x04" + self.id +"\0"
			},
			parser : self.session.readiter,
			callback : callback
		});
	};

	this.execute = function(callback) {
		self.session.send_command({
			send : function() {
				return "\x05" + self.id +"\0"
			},
			parser : self.session.parser2,
			callback : callback
		});
	};

	this.info = function(callback) {
		self.session.send_command({
			send : function() {
				return "\x06" + self.id +"\0"
			},
			parser : self.session.parser2,
			callback : callback
		});
	};

	this.options = function(callback) {
		self.session.send_command({
			send : function() {
				return "\x07" + self.id +"\0"
			},
			parser : self.session.parser2,
			callback : callback
		});
	};

	// request id
	session.send_command({
		blocking : true,
		send : "\0" + query +"\0",
		parser : self.session.parser2,
		callback : function(err, reply) {
			self.id = reply.result;
		//	if (exports.debug_mode) {
		//		console.log("Query id: ", self.id, ", query: ", query);
		//	}
			;
			self.session.setBlock(false);
		}
	});
};
exports.Query = Query;