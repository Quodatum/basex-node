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
The API is modelled closely on the [BaseX client protocol](http://docs.basex.org/wiki/Server_Protocol#Command_Protocol)
See the [examples](https://github.com/apb2006/basex-node/tree/master/examples) for more details 
# Create a Client Session
````
        var basex=require("basex");
		var session=basex.Session(host, port, username, password)
````
The default values are:		
		hostname (default="localhost")
		port (default=1984)
		username (default="admin")
		password (default= "admin")

# Session commands

##execute
````
	session.execute(command,callback)
````
Executes a command on the server calls `callback` with the result.
Example
````
client.execute("create db test_db", log.print);
````
##query
````
	var query=session.query(query)
````	
Returns a query object for the specified query, see below for more detail.
Example
````
var input = 'for $i in 1 to 100 return <xml>Text { $i }</xml>';
var query = session.query(input);
````
##create
````
	session.create(name,in,callback)
````
Creates a database from an input stream.
````
// create new database
client.create("test_db", "<x>Hello World!</x>", log.print);
````

##add
````
	session.add(name,target,in,callback)
````
Adds a document to the current database from an input stream or a string.
Example
````	
// add document from stream
var s=fs.createReadStream(__dirname+ "/books.xml");
client.add("/world/World.xml", s, log.print);
````
##replace
````
	session.replace(path,in,callback)
````
Replaces a document with the specified input stream.
    
##store
````
	session.store(path,in,callback)
````
Stores raw data at the specified path.

##watch
````
	session.watch(name,notification,callback)
````
Request notifications for event with `name`. The function `notification` is called
each time an event with the name is received. The signature is `notification(name,data)`.
````
function watchCallback(name,msg){
console.log("watch update-----> ",msg)
};
session1.watch("testevent",watchCallback, log.print);
````
##unwatch
````
	session.unwatch(name,callback)
````
Unwatches the specified event.

##info
	session.info(callback)
Returns process information.

##close
	session.close(callback)
Closes the session. 

# The query object
Create a query object `var q=session.query(query)`, then `bind` any external variables, 
finally call `results or `execute`
##bind
````
   query.bind(name,value,type,callback);
````   
Binds a `name` to a `value`. Currently `type` is ignored.
````
query.bind("name", "nodex","",log.print); 
````  
##close   
   query.close();
##results   
   query.results(callback);
Returns results as an array.
````
query.results(log.print);
````   
##execute
````   
   query.execute(callback);
````
Executes the query and returns all results as a single string. 
   
##info   
   query.info(callback);
   
##options   
   query.options(callback);
   
# Debugging
The `index.js` module variable `debug_mode` can be set to true to 
print diagnostic info to the console.