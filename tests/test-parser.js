/* basex-node test parser using vows
 */
var vows = require('vows')
	, assert = require('assert')
	,parser = require('../lib/parser.js');

//Create a Test Suite
vows.describe('Parser test').addBatch({
	'read fld' : {
		topic : {buffer:"abc\0\0"},

		'got a fld' : function(topic){
			var r=parser.popmsg(topic,["test"])
			assert.equal(r.test, "abc");
		}
	},
	"after read":{
		topic : {buffer:"abc\0\0"},
		
		'buffer changed' : function(topic){
						var r=parser.popmsg(topic,["test"])
						assert.equal(topic.buffer, "");
						}
	},
	"status":{
		topic : {buffer:"\0"},
		
		'got' : function(topic){
			var r=parser.popmsg(topic,[])
			assert.equal(r.ok, true);
		}
	},
	"status wrong":{
		topic : {buffer:"\2"},
		
		'error thrown' : function(topic){
			assert.throws(function (){
				var r=parser.popmsg(topic,[])
			},"expected status marker")
		}
	}
}).addBatch({
	'no status' : {
		topic : {buffer:'a\0b\0'},

		'is parsed' : function(topic) {
			var r=parser.popmsg(topic,["name","msg"],false);
			assert.isObject(r);
		}
	}
}).export(module); // Run it