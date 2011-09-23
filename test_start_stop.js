require.paths.unshift(__dirname + "/../");
var sys = require("sys");
sys.puts("Modified require.paths: " + require.paths);

var basex = require("./index");
var client = basex.createClient(1984, "127.0.0.1", {
	"username" : "admin",
	"password" : "admin"
});

basex.debug_mode = true;
client.info(basex.print);
client.close();

// A workaround is:
// client.info(function (err, res) {
// console.log(res.toString());
// client.quit();
// });

