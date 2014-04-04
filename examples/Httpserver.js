// create webserver on port 9000
// shows baseX info 
var basex = require("../index");
var http = require('http');

/**
 * Description
 * @method list
 * @param {} req
 * @param {} res
 * @return 
 */
function list(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});  
	session.execute("info", function(err, r) {
		res.write("<pre>");
		res.write(r.result);
		res.write("</pre>");
		res.end();
	})
};

var session = new basex.Session();
http.createServer(list).listen(9000);

console.log('Server running at port:9000');
