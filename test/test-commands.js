/* 
 * basex-node test interface using mocha
 */

var basex = require('../index.js');
var should = require("should");

var session = new basex.Session();

describe('Execute info command', function() {
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

describe('Send an valid xquery statement:  2+2', function() {
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

describe('Send an invalid command:  2+', function() {
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

describe('Add a document', function() {
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

describe('Add an invalid document', function() {
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

describe('create database', function() {
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

describe('drop db database', function() {
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

describe('Send a xquery and iterate over the result items', function() {
	var reply, err;
	before(function(done) {
		var input = 'for $i in 1 to 10 return <xml>Text { $i }</xml>';
		var query = session.query(input);

		query.results(function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('It should not error', function() {
		should.not.exist(err);
	});
	it('It should return an array', function() {
		reply.result.should.be.an.Array;
	});
});

describe(
		'create query and bind ',
		function() {
			var reply, err;
			before(function(done) {
				var input = "declare variable $name external; for $i in 1 to 10 return element { $name } { $i }";
				var query = session.query(input);

				// bind variable
				query.bind("name", "nodex");

				// print results
				query.execute(function(e, r) {
					reply = r;
					err = e;
					done();
				});
			});

			it('It should not error', function() {
				should.not.exist(err);
			});
			it('It should return a string', function() {
				reply.result.should.be.a.String
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
