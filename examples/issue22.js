/*
 * socket errors #22
 */
const basex = require("../index");

basex.debug_mode = false;
var session;
var timerknockSocketError = false;
var timerknockWork = false;

function  socketError(e){
if (timerknockWork) {   
    console.log("================ clearTimeout timerknockWork ======================");
    clearTimeout(timerknockWork);
  }
  
  console.log("socket trouble detected..",e.code);
  if (e.code == 'ECONNREFUSED') {
    console.error('connection refused. Check BaseX server is running. Restarting client in 15 seconds');
    timerknockSocketError = setTimeout(work, 15000); // 15 seconds pass..
  } else if(e.code == 'ECONNRESET' || e.code == 'EPIPE'){
    console.log("Restarting client in 10 seconds");
    timerknockSocketError = setTimeout(work, 10000); // 10 seconds pass..
  } else {
    console.error("SOCKET ERROR: ", e.code,":", e);
  }
};
function work(){
console.log("New session");
  if (timerknockSocketError) {
      // some statement
      console.log("================ clearTimeout timerknock SocketError ======================");
      clearTimeout(timerknockSocketError);
    }
  session = new basex.Session();
  session.on("socketError",socketError);
  // poll server time every second
  timerknockWork = setInterval(serverdateTime,1000);
};


function serverdateTime() {
    var query = 'fn:current-dateTime()';
    var q = session.query(query)
    q.execute((e, r) => { console.log("Result: ", r.result, "; Error:", e);});
};



work();




