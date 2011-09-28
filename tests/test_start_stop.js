require.paths.unshift(".");
var sys = require("sys");
sys.puts("Modified require.paths: " + require.paths);


var basex  = require("../index"),
    client = basex.createClient();

basex.debug_mode = true;

client.info(basex.print);
client.close(basex.print);

// A workaround is:
// client.info(function (err, res) {
//     console.log(res.toString());
//     client.quit();
// });

