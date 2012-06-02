The BaseX Node client is asynchronous.  Most functions take an optional
callback function as last argument. The callback function will be 
called with two arguments when the results are available .
The first `err` will contain any error information or null if there is no error
The second `reply` will hold the reply. The reply is often an object with
 `result` and `info` properties.

		{ result: '1 2 3 4 5 6 7 8 9 10',
		  info: '\nQuery executed in 0.38 ms.\n' }

The utility function `print` in the debug module shows the syntax:
 
		function print(err, reply) {
			if (err) {
				console.log("Error: " + err);
			} else {
				console.dir(reply);
			}
		}; 

## Create a Client Session
        var basex=require("basex");
		var session=basex.Session(host, port, username, password)
The default values are:		
		hostname (default="localhost")
		port (default=1984)
		username (default="admin")
		password (default= "admin")

## Session commands
    //Executes a command and returns the result:
	session.execute(command,callback)

	//Returns a query object for the specified query, see below for more detail:
	var query=session.query(query)

	//Creates a database from an input stream:
	session.create(name, in,callback)

	//Adds a document to the current database from an input stream:
	session.add( name,  target,  in,callback)

	//Replaces a document with the specified input stream:
	session.replace( path,  in,callback)

	//Stores raw data at the specified path:
	session.store( path,  in,callback)

	//Watches the specified event:
	session.watch( name, notification,callback)

	//Unwatches the specified event:
	session.unwatch( name,callback)

	//Returns process information:
	session.info(callback)

	//Closes the session:
	session.close(callback)
 

## The query object

   query.bind(name,value,callback);
   
   query.close();
   
   query.results(callback);
   
   query.execute(callback);
   
   query.info(callback);
   
   query.options(callback);
   
## Debugging
The basex module variable `debug_mode` can be set to true to 
print diagnostic info to the console.