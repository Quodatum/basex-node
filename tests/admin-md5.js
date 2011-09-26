var crypto = require('crypto');
var hash = crypto.createHash('md5').update('admin').digest("hex");
console.log(hash);

