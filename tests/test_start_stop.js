var basex  = require("./index"),
    client = basex.createClient();

// This currently doesn't work, due to what I beleive to be a bug in basex 2.0.1.
// INFO and QUIT are pipelined together, and the socket closes before the INFO
// command gets a reply.

basex.debug_mode = true;
client.info(basex.print);
client.quit();

// A workaround is:
// client.info(function (err, res) {
//     console.log(res.toString());
//     client.quit();
// });

