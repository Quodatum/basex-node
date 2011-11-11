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
(tested against BaseX version 7.0.1)
1. Run `basexserver`


## Tests
…


# TODO
 * Error handling
 * watch
 * reconnect


# Inspiration
Parts taken from:
https://github.com/mranney/node_redis
