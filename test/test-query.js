/* 
 * basex-node test query bind interface using mocha
 */

var basex = require('../src');
var should = require("should");

var session = new basex.Session();


describe(
		'[query] create query and bind ',
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

describe(
		'[query] create query and bind with type ',
		function() {
			var reply, err;
			before(function(done) {
				var input = "declare variable $max external := 20; for $i in 1 to $max return element Number { $i }";
				var query = session.query(input);

				// bind variable with type
				query.bind("max", 50, "xs:integer");

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
		
describe('[query] Send a xquery and iterate over the result items', function() {
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
//-----------------------------
beforeEach(function() {
	// console.log('before every test')
});

after(function() {
	session.close();
	// console.log('after..');
});