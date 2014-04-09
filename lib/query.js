/**
 * BaseX Node.js client query handler
 * http://docs.basex.org/wiki/Server_Protocol
 * andy bunce 2011-2012
 */

/**
 * @constructor Query
 * @param {} session
 * @param {} query
 * @return 
 */
function Query(session, query) {
	this.session = session;
	this.query = query;
	this.id = null;
	this.cache = [];
	this.state = "type";
	var self = this;
    this.popByte=session.bxp.popByte;
	/**
	 * close the connection
	 * @method close
	 * @param {} callback
	 * @return 
	 */
	this.close = function(callback) {
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() { // send is function as needs id
				return "\x02" + self.id + "\0"
			},
			parser : self.session.parseResult,
			callback : callback
		});
	};

	/**
	 * Description
	 * @method bind
	 * @param {} name
	 * @param {} value
	 * @param {} type
	 * @param {} callback
	 * @return 
	 */
	this.bind = function(name, value, type, callback) {
		var type = "";
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() {
				return "\x03" + self.id + "\0" + name + "\0" + value + "\0"
						+ type + "\0"
			},
			parser : self.session.parseResult,
			callback : callback
		});

	};

	/**
	 * requests query results
	 * @method results
	 * @param {} callback
	 * @return 
	 */
	this.results = function(callback) {
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() {
				return "\x04" + self.id + "\0"
			},
			parser : self.parseResults,
			callback : callback
		});
	};

	/**
	 * Iterator: returns array of items:
	 * @method parseResults
	 * @return 
	 */
	this.parseResults = function() {
		var progress;
		do {
			// console.log("state",self.state,self.cache)
			progress = false;
			switch (self.state) {
			case "type":
				var r = self.popByte();
				if (r) {
					self.state = (r.data == "\0") ? "status" : "item";
					progress = true;
				}
				break
			case "item":
				var r = self.session.bxp.need(["data"],false);
				if (r) {
					self.state = "type";
					self.cache.push(r.data);
					progress = true;
				}
				break
			case "status":
				var r = self.popByte();
				if (r) {
					if (r.data == "\0") {
						return {
							ok : true,
							result : self.cache
						}
					} else {
						self.state = "error"
					}
					progress = true;
				}
				break
			case "error":
				var r = self.session.bxp.need(["result"],false)
				if (r) {
					return {
						ok : false,
						result : self.cache,
						info : r.result
					}
				}
				break
			}
		} while (progress)
	};

	/**
	 * Description
	 * @method execute
	 * @param {} callback
	 * @return 
	 */
	this.execute = function(callback) {
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() {
				return "\x05" + self.id + "\0"
			},
			parser : self.session.parseResult,
			callback : callback
		});
	};

	/**
	 * Description
	 * @method info
	 * @param {} callback
	 * @return 
	 */
	this.info = function(callback) {
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() {
				return "\x06" + self.id + "\0"
			},
			parser : self.session.parseResult,
			callback : callback
		});
	};

	/**
	 * Description
	 * @method options
	 * @param {} callback
	 * @return 
	 */
	this.options = function(callback) {
		self.session.send_command({
			/**
			 * Description
			 * @method send
			 * @return BinaryExpression
			 */
			send : function() {
				return "\x07" + self.id + "\0"
			},
			parser : self.session.parseResult,
			callback : callback
		});
	};

	// request id
	session.send_command({
		blocking : true,
		send : "\0" + query + "\0",
		parser : self.session.parseResult,
		/**
		 * Description
		 * @method callback
		 * @param {} err
		 * @param {} reply
		 * @return 
		 */
		callback : function(err, reply) {
			self.id = reply.result;
			// if (exports.debug_mode) {
			// console.log("Query id: ", self.id, ", query: ", query);
			// }
			;
			self.session.setBlock(false);
		}
	});
};
exports.Query = Query;