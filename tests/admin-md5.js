var crypto = require('crypto');
var pw="admin";
var ts="33281829888336";
var p1 = crypto.createHash('md5').update(pw).digest("hex");
var p2 = crypto.createHash('md5').update(p1 + ts).digest("hex");
console.log(p2+"\x00");

