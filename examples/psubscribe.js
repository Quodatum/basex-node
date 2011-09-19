var basex = require("basex"),
    client1 = basex.createClient(),
    client2 = basex.createClient(),
    client3 = basex.createClient(),
    client4 = basex.createClient(),
    msg_count = 0;

basex.debug_mode = false;

client1.on("psubscribe", function (pattern, count) {
    console.log("client1 psubscribed to " + pattern + ", " + count + " total subscriptions");
    client2.publish("channeltwo", "Me!");
    client3.publish("channelthree", "Me too!");
    client4.publish("channelfour", "And me too!");
});

client1.on("punsubscribe", function (pattern, count) {
    console.log("client1 punsubscribed from " + pattern + ", " + count + " total subscriptions");
    client4.end();
    client3.end();
    client2.end();
    client1.end();
});

client1.on("pmessage", function (pattern, channel, message) {
    console.log("("+  pattern +")" + " client1 received message on " + channel + ": " + message);
    msg_count += 1;
    if (msg_count === 3) {
        client1.punsubscribe();
    }
});

client1.psubscribe("channel*");
