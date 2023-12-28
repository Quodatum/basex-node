/* 
 * basex-node test interface using mocha
 */

var basex = require('../src/index.js');
var should = require("should");

var session = new basex.Session();

describe('[commands] Execute info command', function() {
	var reply, err;
	before(function(done) {
		session.execute("info", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('should not error', function() {
		should.not.exist(err);
	});
	it('should have reply', function() {
		should.exist(reply);
	});

});

describe('[commands] Send valid xquery statement:  2+2', function() {
	var reply, err;
	before(function(done) {
		session.execute("xquery 2+2", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
	it('It should equal 4', function() {
		reply.result.should.equal("4");
	});

});

describe('[commands] Send an invalid command:  2+', function() {
	var reply, err;
	before(function(done) {
		session.execute("xquery 2+", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should  error', function() {
		should.exist(err);
	});
});

describe('[commands] Create a database testdb using execute', function() {
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

describe('[commands] Add a document', function() {
	var reply, err;
	before(function(done) {
		session.add("/world/World.xml", "<x>Hello World!</x>", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
});

describe('[commands] Add an invalid document', function() {
	var reply, err;
	before(function(done) {
		session.add("/world/World.xml", "<\"x\">Hello World!</x>", function(e,
				r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should error', function() {
		should.exist(err);
	});
});

describe('[commands] drop db testdb', function() {
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

describe('[commands] create database', function() {
	var reply, err;
	before(function(done) {
		session.create("testdb", "<x>Hello World!</x>", function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
});

describe('[commands] drop db database', function() {
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
