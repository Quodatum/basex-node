// standalone basex test
var bstream =require("../index");
bstream.debug_mode = false;

var cmds=["OPEN snipsnap","XQUERY 1 to 5","XQUERY count(//*)"];
var s=new bstream.Session();

s.on("connected",function(res){
	console.log("on.connected");
	s.send(cmds.shift());
	});

s.on("reply",function(res){
	console.log("on.reply",res);
	if(cmds.length){
		s.send(cmds.shift());
	}else{
		s.execute("info",function(){console.log("info callback")});
		s.close();
	}
	
});



