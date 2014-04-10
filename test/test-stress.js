/* basex-node test interface using mocha, with streaming data
 * 
 */

var basex = require('../index.js');
var should = require("should");

var session = new basex.Session();

describe('Send a xquery and iterate over the 1000000 result items ', function() {
	var reply, err;
	before(function(done) {
		// create query instance
		var input = 'for $i in 1 to 1000000 return <xml>Text { $i }</xml>';
		var query = session.query(input);

		query.results( function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('should not error', function() {
		should.not.exist(err);
	});
});

describe('return megabyte result from execute ', function() {
	var reply, err;
	before(function(done) {
		// create query instance
		var input = 'xquery (1 to 100000)!"abcdefghij"';		
		session.execute(input, function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('should not error', function() {
		should.not.exist(err);
	});
});

describe('return megabyte result from query ', function() {
	var reply, err;
	before(function(done) {
		// create query instance
		var input = '(1 to 100000)!"abcdefghij"';
		var query = session.query(input);

		query.results( function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('should not error', function() {
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