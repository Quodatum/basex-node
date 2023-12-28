/* 
 * basex-node test query bind interface using mocha
 */

var basex = require('../src/index.js');
var should = require("should");

var session = new basex.Session();


describe(
	'[options] create query get options ',
	function () {
		var reply, err;
		before(function (done) {
			var input = "declare option output:method 'text';<xml>Hi there</xml>";
			var query = session.query(input);


			// print results
			query.options(function (e, r) {
				reply = r;
				err = e;
				done();
			});
		});

		it('It should not error', function () {
			should.not.exist(err);
		});
		// "method=text"
		it('It should return a string', function () {
			reply.result.should.be.a.String
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