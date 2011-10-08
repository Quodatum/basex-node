basex - a node.js Basex client 
===========================

This is BaseX client for node.js. Work in progress. 

[BaseX](http://basex.org/) is an XML database. BaseX is a lightweight JAVA server
that supports XPath, Xquery and XSLT. It includes Full Text search and Update Extensions.


## Installing the BaseX Node client

The easiest way to install is using `npm`. 
This module is available from the npm [repository](http://search.npmjs.org/#/basex)
   
		andy@ThinkPad-T42:/tmp$ mkdir project1;cd project1
		andy@ThinkPad-T42:/tmp/project1$ npm install basex
		basex@0.3.0 ./node_modules/basex 
Test it. This assumes BaseX is running on the host

		andy@ThinkPad-T42:/tmp/project1$ cd node_modules/basex/examples/
		andy@ThinkPad-T42:/tmp/project1/node_modules/basex/examples$ node Example.js 
		milliseconds: 0
		{ result: '1 2 3 4 5 6 7 8 9 10',
		  info: '\nQuery executed in 0.38 ms.\n' }
		end
		close
		andy@ThinkPad-T42:/tmp/project1/node_modules/basex/examples$ 


## Installing BaseX
Requires Java.
1. Download from http://basex.org/products/download/all-downloads/
tested against BaseX version 7.0
1. run the basexserver script


## Tests
..

## TODO
Error handling, watch, reconnect...

## Inspiration
Parts taken from https://github.com/mranney/node_redis
