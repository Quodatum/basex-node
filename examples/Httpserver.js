// create webserver on port 9000
// shows baseX info 
var basex = require("../index");
var http = require('http');

function list(req, res) {
	res.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	session.execute("info", function(err, r) {
		res.write(r.result);
		res.end();
	})
};

var session = new basex.Session();
http.createServer(list).listen(9000);

console.log('Server running at port:9000');
