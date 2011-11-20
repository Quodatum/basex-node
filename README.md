# basex - A BaseX client for node.js  
===========================

This is BaseX client for node.js. It is work in progress. 

[BaseX](http://basex.org/) is an XML database.	Built as a lightweight Java server, BaseX supports XPath, XQuery, and XSLT.  


It also boasts **full text search** and **update extensions**.


## Installing the BaseX Node client

The best way to install this is with `npm` (available from [this repository](http://search.npmjs.org/#/basex)).

```bash
	$ mkdir project1;cd project1
	$ npm install basex
	basex@0.3.0 ./node_modules/basex 
```

Once BaseX is running, test it. 

```bash
	$ cd node_modules/basex/examples/
	$ node Example.js 
	milliseconds: 0
	{ result: '1 2 3 4 5 6 7 8 9 10',
	  info: '\nQuery executed in 0.38 ms.\n' }
	end
	close
```

## Installing BaseX
1. Java is required
1. [Download](http://basex.org/products/download/all-downloads/) (http://basex.org/products/download/all-downloads/)
(tested against BaseX version 7.0.2)
1. Run `basexserver &`


## Tests
A test suite using [vows](http://vowsjs.org/) can be run.

```bash
		vows test/*  --spec
		
		♢ BaseX interface test
		
		  Request info
		    ✓ we get no error
		    ✓ we get a reply
		  Send an valid xquery statement:  2+2
		    ✓ we get no error
		    ✓ and the answer is 4
		  Send an invalid command:  2+
		    ✓ we get an error
		  Create a database
		    ✓ we get no error
		  Add a document
		    ✓ we get no error
		  Drop the database
		    ✓ we get no error
		  Send a xquery and iterate over the result items
		    ✓ we get no error
		    ✓ and the result is an array
		 
		✓ OK » 10 honored (0.253s)
```

# TODO
 * pipeline send commands
 * watch
 * reconnect


# Inspiration
Parts copied from [node_redis](https://github.com/mranney/node_redis)
