/*
 * socket errors #22
 */
const basex = require("../index");
var session = new basex.Session()
basex.debug_mode = false;
function performQuery(q_str) {
    return new Promise(rs => {
        var q = session.query(q_str)
        q.execute((e, r) => {
            console.log("Result: ", r.result, "; Error:", e);
        })
    })
}

session.on("socketError",
    (e)=>{console.log("I should handle this: ",e)}
    );
var query = 'fn:current-dateTime()';
// poll server time
setInterval(()=>{performQuery(query)},1000);

