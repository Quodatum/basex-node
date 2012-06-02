// standalone basex test
var basex =require("../index");
var log = require("../debug");
basex.debug_mode = true;

var s=new basex.Session();
s.execute("info",log.print);
s.execute("list",log.print);
s.execute("OPEN factbook",log.print);
s.execute("XQUERY 1 to 5",log.print);
s.execute("XQUERY count(//*)",log.print);
s.close();





