/*
 * socket errors #22
 */
const basex = require("../index");

basex.debug_mode = false;
var session;


function  socketError(e){
  console.log("socket trouble detected..",e.code);
  if (e.code == 'ECONNREFUSED') {
    console.error('connection refused. Check BaseX server is running.');
  } else if(e.code == 'ECONNRESET' || e.code == 'EPIPE'){
    console.log("Restarting client in 10 seconds");
    setTimeout(work, 10000); // 10 seconds pass..
  } else {
    console.error("SOCKET ERROR: ", e.code,":", e);
  }
};
function work(){
  console.log("New session");
  session = new basex.Session();
  session.on("socketError",socketError);
  // poll server time every second
  setInterval(serverdateTime,1000);
};


function serverdateTime() {
    var query = 'fn:current-dateTime()';
    var q = session.query(query)
    q.execute((e, r) => { console.log("Result: ", r.result, "; Error:", e);});
};



work();




