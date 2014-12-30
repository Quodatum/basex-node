/* basex-node test interface using mocha, 
 * with streaming data   
 */

var basex = require('../index.js');
var fs = require("fs");
var should = require("should");

var session = new basex.Session();

describe('Create a database testdb from stream', function() {
	var reply, err;
	before(function(done) {
		var str=fs.createReadStream(__dirname+ "/resources/books.xml");
		session.create("testdb",str, function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
});

describe('Add doc from stream', function() {
	var reply, err;
	before(function(done) {
		var str=fs.createReadStream(__dirname+ "\\resources\\books.xml");
		session.add("same/again.xml",str, function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
});
describe('drop db testdb', function() {
	var reply, err;
	before(function(done) {
		session.execute("drop db testdb", function(e, r) {
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