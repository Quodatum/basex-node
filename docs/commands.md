The BaseX Node client is asynchronous.  Most functions take an option
callback function as last argument. The callback function will be 
called when the results are available with two arguments.
The first will contain any error information or null if there is no error
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

//Executes a command and returns the result:
	session.execute(command,callback)

	//Returns a query object for the specified query:
	var query=session.query(query)

	//Creates a database from an input stream:
	session.create(name, in)

	//Adds a document to the current database from an input stream:
	, "add" // (String name, String target, InputStream in)

	//Replaces a document with the specified input stream:
	, "replace" // (String path, InputStream in)

	//Stores raw data at the specified path:
	, "store" // (String path, InputStream in)

	//Watches the specified event:
	, "watch" // (String name, Event notifier)

	//Unwatches the specified event:
	, "unwatch" // (String name)

	//Returns process information:
	, "info"

	//Closes the session:
	, "close"
 
## execute

## create
## add
## replace
## store
## info
## close

## The query object


## Debugging
The basex module variable `debug_mode` can be set to true to 
print diagnostic info to the console.