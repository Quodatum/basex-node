/* 
 * basex-node test query bind interface using mocha
 */

var basex = require('../src/index.js');
var should = require("should");

var session = new basex.Session();


describe(
	'[options] create query get options ',
	function () {
		var reply, err,serialization;
		before(function (done) {
			var input = "declare option output:method 'text';<xml>Hi there</xml>";
			var query = session.query(input);


			// print results
			query.options(function (e, r) {
				serialization = r.result;
				err = e;
				query.results(
					function (e, r) {
						reply = r;
						err = e;
						done();
			});
			});
		});

		it('It should not error', function () {
			should.not.exist(err);
		});
		// "method=text"
		it('serialization should return a string', function () {
			serialization.should.equal("method=text");
		});
		it('reply should return a string', function () {
			reply.result[0].should.equal("Hi there");
		});
	});

//-----------------------------
beforeEach(function () {
	// console.log('before every test')
});

after(function () {
	session.close();
	// console.log('after..');
});