The BaseX Node client is asynchronous.  Most functions take an option
callback function as last argument. The callback function will be 
called when the results are available with two arguments.
The first will contain any error infomation or null if there is no error
the second will hold the result.
The utility function `print` shows the syntax:
 
		function print(err, reply) {
			if (err) {
				console.log("Error: " + err);
			} else {
				console.dir(reply);
			}
		}; 

## Session
var client=Session(host, port, username, password)
	hostname (default="localhost")
	port (default=1984)
	username (default="admin")
	password (default= "admin")

 
## execute

## create
## add
## replace
## store
## info
## close

## query

## Debugging
The basex module variable `debug_mode` can be set to true to 
print diagnostic info to the console.