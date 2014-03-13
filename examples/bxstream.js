// test basexstream class
var bxs=require("../lib/basexstream");
var fs = require('fs');
var rs=new bxs.ReceiveStream();


rs.on("data",function(data){
console.log(data)
});
rs.on("marker",function(data){
console.log("marker")
});

var writeStream = fs.createWriteStream('someFile.txt', { flags : 'w' });
writeStream.on('close', function () {
    console.log('All done!');
});
rs.pipe(writeStream);
var b=new Buffer("aaaaaaaaaaaaaaaaaaab\x00c\xFF\x00fg\x0099","binary");
rs.write(b);
console.log("-------------------------")

var ss=new bxs.SendStream();
ss.on("data",function(data){
console.log(data)
});
var b=new Buffer("aaaaa\x00bbb\xFFcccc ","binary");
ss.write(b);