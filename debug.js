/**
 * example functions for use as test callbacks
 * andy bunce 2011-2014
 **/

/**
 * @method print
 * @param {} err
 * @param {} reply
 * @return 
 */
function print(err, reply) {
	if (err) {
		console.log("Error: " + err);
	} else {
		console.dir(reply);
	}
};
 
/**
 * show supplied msg then basex server response
 * @method printMsg
 * @param {} msg
 * @return FunctionExpression
 */
function printMsg(msg) {
	return function(err, reply){
		console.log("printMsg: ",msg);
		if(arguments.length==2) print(err, reply)
		}
};
exports.print = print;
exports.printMsg = printMsg;