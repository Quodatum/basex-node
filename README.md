# basex - A BaseX client for node.js  
===========================

This is a [BaseX](http://basex.org/) client for Node.js. 
It uses the [client interface](http://docs.basex.org/wiki/Server_Protocol)
 via a socket connection to the BaseX server.

BaseX is a very light-weight, high-performance and scalable
 XML Database engine and XPath/XQuery 3.0 Processor, 
 including full support for the W3C Update and Full Text extensions.
Built as a lightweight Java server, BaseX also supports XSLT, Webdav and RestXQ.  

## Installing the BaseX Node client
[![Npm package monthly downloads](https://badgen.net/npm/dm/basex)](https://npmjs.com/package/basex)

To install with npm:

`npm install basex`

```bash
	$ mkdir myproject
	cd myproject
	$ npm install basex
	basex@1.0.0 ./node_modules/basex 
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
(tested against versions 9.6,8.6)
1. Run `basexserver -S`

## API specification

See [commands.md](https://github.com/apb2006/basex-node/blob/master/docs/commands.md)
 in the docs folder for details of the API.
 
## Tests
There is a test suite using [mocha](http://mochajs.org/)
, [should](https://github.com/visionmedia/should.js) and
[sinon](http://sinonjs.org/).

```bash
mocha test

 [auth] password good
    √ should not error

  [auth] password bad
    √ should throw error

  [commands] Execute info command
    √ should not error
    √ should have reply

  [commands] Send valid xquery statement:  2+2
    √ It should not error
    √ It should equal 4

  [commands] Send an invalid command:  2+
    √ It should  error

  [commands] Create a database testdb using execute
    √ It should not error

  [commands] Add a document
    √ It should not error

  [commands] Add an invalid document
    √ It should error

  [commands] drop db testdb
    √ It should not error

  [commands] create database
    √ It should not error

  [commands] drop db database
    √ It should not error

  [parser] Parser test?
    √ should pop abc

  [query] create query and bind
    √ It should not error
    √ It should return a string

  [query] create query and bind with type
    √ It should not error
    √ It should return a string

  [query] Send a xquery and iterate over the result items
    √ It should not error
    √ It should return an array

  [stream] Create a database testdb from stream
    √ It should not error

  [stream] Add doc from stream
    √ It should not error

  [stream] drop db testdb
    √ It should not error

  [stress] Send a xquery and iterate over the 1000000 result items
    √ should not error

  [stress] return megabyte result from execute
    √ should not error

  [stress] return megabyte result from query
    √ should not error


  26 passing (2s)
```
# Tools

Javascript is formated using js-beautify `js-beautify -r index.js`

Documentation is generated using `jsdoc -r -d docs --verbose index.js`

# Contributing

Anyone is welcome to submit issues and pull requests

Thanks to: 

-    [jesseclark](https://github.com/jesseclark)
-    [Zearin](https://github.com/Zearin)
-    [Zearin](https://github.com/Zearin)
-    [salim-dev](https://github.com/salim-dev)

# Todo
 * stream i/o
 * reconnect
 
# Alternative clients
* https://github.com/alxarch/basex-stream
* https://github.com/nerdenough/node-basex
* https://github.com/hanshuebner/simple-basex

# Inspiration
Parts inspired by [node_redis](https://github.com/mranney/node_redis), 
[BaseX Java client](https://github.com/BaseXdb/basex/blob/master/basex-examples/src/main/java/org/basex/examples/api/BaseXClient.java)

# License

BSD license
