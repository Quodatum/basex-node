var basex  = require("basex"),
    client = basex.createClient(), multi;

// start a separate command queue for multi
multi = client.multi();
multi.incr("incr thing", basex.print);
multi.incr("incr other thing", basex.print);

// runs immediately
client.mset("incr thing", 100, "incr other thing", 1, basex.print);

// drains multi queue and runs atomically
multi.exec(function (err, replies) {
    console.log(replies); // 101, 2
});

// you can re-run the same transaction if you like
multi.exec(function (err, replies) {
    console.log(replies); // 102, 3
    client.quit();
});

client.multi([
    ["mget", "multifoo", "multibar", basex.print],
    ["incr", "multifoo"],
    ["incr", "multibar"]
]).exec(function (err, replies) {
    console.log(replies.toString());
});
