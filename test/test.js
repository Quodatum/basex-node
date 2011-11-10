// http://vowsjs.org/#installing
var vows = require('vows'),
    basex =require("../index"),
    assert = require('assert');
var client = new basex.Session();
// Create a Test Suite
vows.describe('Connect').addBatch({
    'get info': {
        topic: function () { 	
        	client.execute("info",this.callback);
        	},

        'we get some text': function (err,reply) {
        	 assert.isNull   (err);        // We have no error
        	 assert.isObject (reply);       // We have a reply object
        }
    },
    'closing': {
        topic: function () { 	
        	client.close();
        	},

        'we get a value which': {
           
            'is not equal to itself': function (topic) {
                assert.isNull (null);
            }
        }
    }
}).run(); // Run it