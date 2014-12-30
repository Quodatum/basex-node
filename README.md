# basex - A BaseX client for node.js  
===========================

This is a [BaseX](http://basex.org/) client for Node.js. It is work in progress. 
It uses the [client interface](http://docs.basex.org/wiki/Server_Protocol)
 via a socket connection to the BaseX server.

BaseX is a very light-weight, high-performance and scalable
 XML Database engine and XPath/XQuery 3.0 Processor, 
 including full support for the W3C Update and Full Text extensions.
Built as a lightweight Java server, BaseX also supports XSLT, Webdav and RestXQ.  

## Installing the BaseX Node client
[![NPM](https://nodei.co/npm/basex.png?stars&downloads)](https://nodei.co/npm/basex/) [![NPM](https://nodei.co/npm-dl/basex.png)](https://nodei.co/npm/basex/)

To install with npm:

`npm install basex`

```bash
	$ mkdir myproject
	cd myproject
	$ npm install basex
	basex@0.6.0 ./node_modules/basex 
```

Once BaseX is installed and the BaseX server is running, test it. 

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
(tested against version 7.9)
1. Run `basexserver -S`

## API specification

See [commands.md](https://github.com/apb2006/basex-node/blob/master/docs/commands.md)
 in the docs folder for details of the API.
 
## Tests
There is a test suite using [mocha](http://visionmedia.github.com/mocha/)
, [should](https://github.com/visionmedia/should.js) and
[sinon](http://sinonjs.org/).

```bash
mocha -R spec test/test-commands.js 


  Execute info command
    ✓ should not error 
    ✓ should have reply 

  Send an valid xquery statement:  2+2
    ✓ It should not error 
    ✓ It should equal 4 

  Send an invalid command:  2+
    ✓ It should  error 

  Create a database
    ✓ It should not error 

  Add a document
    ✓ It should not error 

  drop db database
    ✓ It should not error 

  drop db database
    ✓ It should not error 

  Send a xquery and iterate over the result items
    ✓ It should not error 
    ✓ It should return an array 

  create query and bind 
    ✓ It should not error 
    ✓ It should return a string 

  13 tests complete (408 ms)

```
# Tools

Javascript is formated using js-beautify `js-beautify -r index.js`

Documentation is generated using `jsdoc -r -d docs --verbose index.js`

# Contributing

Anyone is welcome to submit issues and pull requests

Thanks to: 

-    [jesseclark](https://github.com/jesseclark)
-    [Zearin](https://github.com/Zearin)



# Todo
 * stream i/o
 * reconnect


# Inspiration
Parts inspired by [node_redis](https://github.com/mranney/node_redis), 
[BaseX Java client](https://github.com/BaseXdb/basex/blob/master/basex-examples/src/main/java/org/basex/examples/api/BaseXClient.java)

# License

BSD license


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/apb2006/basex-node/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

