[![build status](https://secure.travis-ci.org/apb2006/basex-node.png)](http://travis-ci.org/apb2006/basex-node)
# basex - A BaseX client for node.js  
===========================

This is BaseX client for node.js. It is work in progress. 

[BaseX](http://basex.org/) is a very light-weight, high-performance and scalable
 XML Database engine and XPath/XQuery 3.0 Processor, 
 including full support for the W3C Update and Full Text extensions.
Built as a lightweight Java server, BaseX also supports XSLT, Webdav and RestXQ.  



## Installing the BaseX Node client

To install with npm:

`npm install basex`

```bash
	$ mkdir myproject
	cd myproject
	$ npm install basex
	basex@0.5.0 ./node_modules/basex 
```

Once BaseX is running, test it. 

```bash
	$ cd examples/
	$ node Example.js 
	milliseconds: 0
	{ result: '1 2 3 4 5 6 7 8 9 10',
	  info: '\nQuery executed in 0.38 ms.\n' }
	end
	close
```

## Installing BaseX
1. Java is required
1. [Download](http://basex.org/products/download/all-downloads/) and install BaseX
(tested against version 7.3)
1. Run `basexserver -S`

## API specification

See [commands.md](https://github.com/apb2006/basex-node/blob/master/docs/commands.md)
 in the docs folder for details of the API.
 
## Tests
There is a test suite, using [vows](http://vowsjs.org/) .

```bash
		vows tests/*  --spec
		
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
 * stream i/o
 * reconnect


# Inspiration
Parts inspired by [node_redis](https://github.com/mranney/node_redis), 
[BaseX Java client](https://github.com/BaseXdb/basex-examples/blob/master/src/main/java/org/basex/examples/api/BaseXClient.java)

#license

BSD license
