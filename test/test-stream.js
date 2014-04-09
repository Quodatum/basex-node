/* basex-node test interface using mocha, with streaming data
 *   @TODO
 */

var basex = require('../index.js');
var fs = require("fs");
var should = require("should");

var session = new basex.Session();

describe('Create a database testdb using execute', function() {
	var reply, err;
	before(function(done) {
		session.execute("create db testdb", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
});


//-----------------------------
beforeEach(function() {
	// console.log('before every test')
});

after(function() {
	session.close();
	// console.log('after..');
});