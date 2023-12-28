/*
 * socket errors #22
 * An example of handling socket errors and reconnecting 
 */
const basex = require("../index");

basex.debug_mode = false;
var session;
var queryTimer;
var BROKEN_SOCKET_CODES= ['ECONNRESET','EPIPE','ERR_STREAM_DESTROYED']; // reconnect required after these
var reconnect_interval= 10000; // retry after 10 secs

function  socketError(e){
  console.log("socket trouble detected..",e.code);
  clearTimeout(queryTimer); // stop sending
  if (e.code == 'ECONNREFUSED') {
    console.error('connection refused. Check BaseX server is running.');
    console.log("Attempting to reconnect in 10 seconds");    
    setTimeout(work, reconnect_interval); // retry..
  }else if( BROKEN_SOCKET_CODES.includes(e.code) ) {   
    console.log("Attempting to reconnect in 10 seconds");    
    setTimeout(work, reconnect_interval); // retry..
  } else {
    console.error("SOCKET ERROR: ", e.code,":", e);
    throw "SOCKET ERROR: "+ e.code
  }
};
function work(){
  console.log("New session");
  session = new basex.Session();
  session.on("socketError",socketError);
  // poll server time every second
  queryTimer=setInterval(serverdateTime,1000);
};

// example server request
function serverdateTime() {
    var query = 'fn:current-dateTime()';
    var q = session.query(query)
    q.execute((e, r) => { console.log("Result: ", r.result, "; Error:", e);});
};



work();




