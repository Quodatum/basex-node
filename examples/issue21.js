/*
 * Next query executed after failed query returns invalid output #21
 */
const basex = require("../index");
var session = new basex.Session()
basex.debug_mode = true;
function performQuery(q_str) {
    return new Promise(rs => {
        var q = session.query(q_str)
        q.execute((e, r) => {
            console.log("Result: ", r.result, "; Error:", e)
            rs()
        })
    })
}

var invalid_query = '(map {"key": "value"})("missing")("key")'
var correct_query = '(map {"key": "value"})("key")'
  
performQuery(correct_query).then(
      performQuery(correct_query)
  )
//console.log("--------------")  
performQuery(invalid_query)
.then(
    performQuery(correct_query)
)
session.close();