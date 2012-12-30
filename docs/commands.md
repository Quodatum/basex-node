# Introduction
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

# Create a Client Session
        var basex=require("basex");
		var session=basex.Session(host, port, username, password)
The default values are:		
		hostname (default="localhost")
		port (default=1984)
		username (default="admin")
		password (default= "admin")

# Session commands

##execute
	session.execute(command,callback)
Executes a command on the server calls `callback` with the result.

##query
	var query=session.query(query)
Returns a query object for the specified query, see below for more detail.

##create
	session.create(name,in,callback)
Creates a database from an input stream.

##add
	session.add(name,target,in,callback)
Adds a document to the current database from an input stream.	

##replace
	session.replace(path,in,callback)
Replaces a document with the specified input stream.
    
##store
	session.store(path,in,callback)
Stores raw data at the specified path.

##watch
	session.watch(name,notification,callback)
Request notifications for event with `name`. The function `notification` is called
each time an event with the name is received. The signature is `notification(name,data)`.

##unwatch
	session.unwatch(name,callback)
Unwatches the specified event.

##info
	session.info(callback)
Returns process information.

##close
	session.close(callback)
Closes the session. 

# The query object

##bind
   query.bind(name,value,type,callback);
Binds a `name` to a `value`. Currently `type` is ignored.
   
##close   
   query.close();
##results   
   query.results(callback);
Returns results as an array.
   
##execute   
   query.execute(callback);
   
##info   
   query.info(callback);
   
##options   
   query.options(callback);
   
# Debugging
The `index.js` module variable `debug_mode` can be set to true to 
print diagnostic info to the console.