
/*
 * This example shows how results from a query can be received in an iterative
 * mode and illustrated in a table. 
 */
var basex  = require("../index");
var fs=require('fs');
var http = require('http');
basex.debug_mode = false;
// commands to be performed
var xq=["factbook_countries.xq","xslt_countries.xq"];

/**
 * Description
 * @method loadfile
 * @param {} src
 * @return CallExpression
 */
function loadfile(src){
	return fs.readFileSync(__dirname+"/"+src,'utf-8')
};
/**
 * Description
 * @method list
 * @param {} req
 * @param {} res
 * @return 
 */
function list(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"}); 
    var query1 = session.query(cmd);
    query1.execute(function(err, r) {
		res.write(r.result);
		res.end();
	});
};
var session = new basex.Session("localhost", 1984, "admin", "admin");
var cmd=loadfile(xq[1]);
//var query = session.query(cmd);
//query.execute(basex.print);

var query0 = session.query(loadfile(xq[0]));
var query1 = session.query(loadfile(xq[1]));

http.createServer(list).listen(9000);
console.log('Server running at port:9000');
