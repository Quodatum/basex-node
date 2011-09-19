// A simple web server that generates dyanmic content based on responses from basex

var http = require("http"), server,
    basex_client = require("basex").createClient();

server = http.createServer(function (request, response) {
    response.writeHead(200, {
        "Content-Type": "text/plain"
    });
    
    var basex_info, total_requests;
    
    basex_client.info(function (err, reply) {
        basex_info = reply; // stash response in outer scope
    });
    basex_client.incr("requests", function (err, reply) {
        total_requests = reply; // stash response in outer scope
    });
    basex_client.hincrby("ip", request.connection.remoteAddress, 1);
    basex_client.hgetall("ip", function (err, reply) {
        // This is the last reply, so all of the previous replies must have completed already
        response.write("This page was generated after talking to basex.\n\n" +
            "basex info:\n" + basex_info + "\n" +
            "Total requests: " + total_requests + "\n\n" +
            "IP count: \n");
        Object.keys(reply).forEach(function (ip) {
            response.write("    " + ip + ": " + reply[ip] + "\n");
        });
        response.end();
    });
}).listen(80);
