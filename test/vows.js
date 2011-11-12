// http://vowsjs.org/#installing

var vows = require('vows'),
    assert = require('assert')
    basex=require('../index.js');
var client = new basex.Session();
// Create a Test Suite
vows.describe('Connection').addBatch({
    'get info': {
        topic: function () {
        	client.execute("info",this.callback);
        	},

        'we get no error': function (err,reply) {
            assert.equal (err, null);
        },
        'we get a reply': function (err,reply) {
            assert.isObject (reply);
        }	
    }
}).addBatch({
	   'get info2': {
	        topic: function () {
	        	client.execute("info",this.callback);
	        	},

	        'we get no error': function (err,reply) {
	            assert.equal (err, null);
	        },
	        'we get a reply': function (err,reply) {
	            assert.isObject (reply);
	        }	
	    }	
}).export(module); // Run it
