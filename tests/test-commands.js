/* basex-node test interface using vows
 * 
 * @TODO teardown connection
 */

var vows = require('vows')
	,assert = require('assert')
	,basex = require('../index.js');

var session = new basex.Session();

// Create a Test Suite
vows.describe('BaseX interface test').addBatch({
	'Request info' : {
		topic : function() {
			session.execute("info", this.callback);
		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);
		},
		'we get a reply' : function(err, reply) {
			assert.isObject(reply);
		}
	}
}).addBatch({
	'Send an valid xquery statement:  2+2' : {
		topic : function() {
			session.execute("xquery 2+2", this.callback);
		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);
		},
		'and the answer is 4' : function(err, reply) {
			assert.equal(reply.result, "4");
		}
	}
}).addBatch({
	'Send an invalid command:  2+' : {
		topic : function() {
			session.execute("xquery 2+", this.callback);
		},

		'we get an error' : function(err, reply) {
			assert.notEqual(err, null);
		}
	}
}).addBatch({
	'Create a database ' : {
		topic : function() {
			session.execute("create db database", this.callback);
		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);
		}
	}
}).addBatch(
		{
			'Add a document ' : {
				topic : function() {
					session.add("/world/World.xml", "<x>Hello World!</x>",
							this.callback);
				},

				'we get no error' : function(err, reply) {
					assert.equal(err, null);
				}
			}
		}).addBatch({
	'Drop the database ' : {
		topic : function() {
			session.execute("drop db database", this.callback);
		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);
		}
	}
}).addBatch({
	'Send a xquery and iterate over the result items ' : {
		topic : function() {
			// create query instance
			var input = 'for $i in 1 to 10 return <xml>Text { $i }</xml>';
			var query = session.query(input);

			query.results(this.callback);
		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);

		},
		'and the result is an array' : function(err, reply) {
			assert.isArray(reply.result);
		}
	}
}).addBatch({
	'create query and bind ' : {
		topic : function() {
			// create query instance
			// create query instance
			var input = "declare variable $name external; for $i in 1 to 10 return element { $name } { $i }";
			var query = session.query(input);

			// bind variable
			query.bind("name", "nodex");

			// print results
			query.execute(this.callback);

		},

		'we get no error' : function(err, reply) {
			assert.equal(err, null);

		},
		'and the result is an array' : function(err, reply) {
			assert.isString(reply.result);
		}
	}
}).export(module); // Run it
