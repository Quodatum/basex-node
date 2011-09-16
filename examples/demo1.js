// Run using
//    node examples/demo1.js
var sys = require("sys");
var basex = require("basex-node");
var client = basex.createClient();    // Create the client


// Assign the string "world" to the "hello" key.
// You can provide a callback to handle the response from Redis
// that gets asynchronously run upon seeing the response.
client.set("hello", "world", function (err, status) {
  if (err) throw err;
  console.log(status); // true
});
