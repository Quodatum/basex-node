// standalone basex test
var basex =require("../index");
basex.debug_mode = false;

var s=new basex.Session();
s.execute("info",basex.print);
s.execute("OPEN snipsnap",basex.print);
s.execute("XQUERY 1 to 5",basex.print);
s.execute("XQUERY count(//*)",basex.print);
s.close();





