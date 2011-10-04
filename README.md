basex - a node.js Basex client 
===========================

This is BaseX client for node.js. Currently this client has minimal functionality. 

[BaseX](http://basex.org/) is an XML database. BaseX has the following features:
 
* High-performance database storage with text, attribute, full-text and path indexes.
* Efficient support of the W3C XPath/XQuery Recommendations 
* Full Text search and Update Extensions.
* XSLT 

## Installing the BaseX Node client

	andy@ThinkPad-T42:/tmp/apb$ npm install ~/Downloads/apb2006-basex-node-0.1-10-g3be132b.tar.gz 
	basex@0.1.0 ./node_modules/basex 
	andy@ThinkPad-T42:/tmp/apb$ ls
	node_modules
	andy@ThinkPad-T42:/tmp/apb$ cd node_modules/
	andy@ThinkPad-T42:/tmp/apb/node_modules$ ls
	basex
	andy@ThinkPad-T42:/tmp/apb/node_modules$ cd basex
	andy@ThinkPad-T42:/tmp/apb/node_modules/basex$ ls
	changelog.md  examples  index.old.js  LICENSE   package.json  tests
	docs          index.js  lib           Makefile  README.md
	andy@ThinkPad-T42:/tmp/apb/node_modules/basex$ node tests/simple.js


## Installing BaseX
Requires Java.
1. Download from http://basex.org/products/download/all-downloads/
tested against version 6.7.1
1. run the basexserver script

## Tests
`node tests/simple.js`

## Changelog
See changelog.md for release notes

## Inspiration
Parts taken from https://github.com/mranney/node_redis
