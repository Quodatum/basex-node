/* basex-node test parser using mocha
 */
var basex = require('../src/index.js');
var should = require("should");
var parser2 = require('../src/lib/parser2.js');
var bxs = require('../src/lib/basexstream.js');



describe('Parser test', function() {
	var b= new Buffer("abc\0\0");
	var s2=new bxs.NopStream()
	it("should pop abc",function (){
	var p=new parser2.parse(s2)
	s2.write(b);
	var r=p.need(["test"],false);
	r.test.should.equal("abc");
	});
});

after(function() {
	
});