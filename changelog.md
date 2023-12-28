# Changelog
## v1.1.0 - 2023-12-28
- add query.options()
- re-org tests
- remove unnessary items from build #1
- add typescript definitions
## v1.0.1  - 2021-09-30
- fix default port #29

## v1.0.0 - 2021-09-29
- removed use of Buffer() see #28
- query bind pass type to server #26
- update `combined-stream` to "1.0.8"
- Node version ">=8.0"
- reworked tests
- reworked sample `issue22.js`

## v0.9.0 - 2017-03-23
- session object now emits socketError events - see #9 #21
- min node version set to 4.0
- dependancies updated  

## v0.8.0 - 2017-03-14
- Remove obsolete event watch interface. 
- Fix #21 query.execute with error.

## v0.7.0 - 2014-12-30
- add streaming data to server
- support v8 style authentication 

## v0.6.3 - 2014-04-03
- fix handling for add where doc is invalid (#14)
- fix tests for node 0.10
- applied js-beautify to the code

## v0.6.2 - 2013-07-13
- fix query array result timing issue (#10)
- fix session.create

## v0.6.1 - 2013-02-17
- fix authorization bug (#8)

## v0.6.0 - 2012-12-29
- implement BaseX escape protocol
- switch from Vows to Mocha for tests

## v0.5.1 - 2012-07-19
- readline fixed

## v0.5.0 - 2012-07-15

- Major bugs fixed
- Support for BaseX events
- Rewrite of parser


## v0.4.1 - 2011-11-09

- err set in callbacks
- connection error handling improved
- better reply parsing including iteration
- attempt to create http://vowsjs.org test suite

## v0.4.0 - 2011-10-09
better response parsing, run against BaseX 7
## v0.3.1 - 2011-10-06
Fixes.
## v0.3.0 - 2011-10-05
Query working except bind and iter.
## v0.2.0 - 2011-10-02
Queue working. Callback working. Query not working
## v0.1.0 - 2011-09-30
login and simple test working
## v0.0.0 - Sept 16, 2011
started.