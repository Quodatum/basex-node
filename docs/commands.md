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

## Create a Client Session
		var session=Session(host, port, username, password)
hostname (default="localhost")
port (default=1984)
username (default="admin")
password (default= "admin")

## Session commands
    //Executes a command and returns the result:
	session.execute(command,callback)

	//Returns a query object for the specified query:
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
	session.watch( name, callback)

	//Unwatches the specified event:
	session.unwatch( name,callback)

	//Returns process information:
	session.info(callback)

	//Closes the session:
	session.close()
 

## The query object

   query.bind(name,value,callback);
   
   query.close();
   
   query.execute(callback);
   
   query.info(callback);
   
   query.options(callback);
   
## Debugging
The basex module variable `debug_mode` can be set to true to 
print diagnostic info to the console.