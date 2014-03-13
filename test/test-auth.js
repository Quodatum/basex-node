/* basex-node test authorisation using mocha
 * 
 */

var basex = require('../index.js');
var should = require("should");



describe('Authorization good', function() {
	var reply, err;
	before(function(done) {
		var session = new basex.Session("127.0.0.1", 1984, "admin", "admin")
		session.close(function(e, r) {
			reply = r;
			err = e;
			done();
		});
	});

	it('should not error', function() {
		should.not.exist(err);
	});
	
});

// http://stackoverflow.com/questions/9025095/how-can-i-test-uncaught-errors-in-mocha
describe('Authorization failure ', function() {
	var reply, err, recordedError = null;
	
	it('should throw error', function(done) {
		var originalException = process.listeners('uncaughtException').pop()
		 //Needed in node 0.10.5+
        process.removeListener('uncaughtException', originalException);
        process.once("uncaughtException", function (error) {
            recordedError = error
            done();
        })
		var session = new basex.Session("127.0.0.1", 1984, "admin", "wrong-password")
		session.close(function(e, r) {
			reply = r;
			err = e;
			//done();
		
	});

});
});

//-----------------------------
beforeEach(function() {
	// console.log('before every test')
});

after(function() {
	// console.log('after..');
});