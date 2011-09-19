var basex = require("basex"),
    client = basex.createClient();

client.on("error", function (err) {
    console.log("basex connection error to " + client.host + ":" + client.port + " - " + err);
});

client.set("string key", "string val", basex.print);
client.hset("hash key", "hashtest 1", "some value", basex.print);
client.hset(["hash key", "hashtest 2", "some other value"], basex.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
