/* BaseX Node.js client
 * http://docs.basex.org/wiki/Server_Protocol
 * @author andy bunce
 * @date 2011-2014
 * @licence BSD
 */

// set this to true to enable console.log msgs for all connections
exports.debug_mode = false;

var net = require("net"),
    util = require("util"),
    events = require("events"),
    crypto = require("crypto"),
    Stream = require('stream').Stream,
    CombinedStream = require('combined-stream'),
    Query = require("./lib/query").Query,
    Watch = require("./lib/watch").Watch,
    parser2 = require("./lib/parser2"),
    Queue = require("./lib/queue").Queue;

var states = {
    DISCONNECTED: 0,
    CONNECTING: 1,
    AUTHORIZE: 2,
    CONNECTED: 3,
    CLOSING: 4
};

var tagid = 0; // used to give each Session a unique .tag property

/**
 * Create a session connection
 * @constructor Session
 * @param {} host
 * @param {} port
 * @param {} username
 * @param {} password
 * @return
 */
var Session = function(host, port, username, password) {
    var self = this;
    this.options = {
        host: host || "127.0.0.1",
        port: port || 1984,
        username: username || "admin",
        password: password || "admin"
    };

    this.tag = "S" + (++tagid);
    this.commands_sent = 0;
    /**
     * reset state
     * @method reset
     * @return
     */
    this.reset = function() {
        this.state = states.DISCONNECTED;
        this.current_command = null; // waiting for response to this
        this.closefn = null;
        this.blocked = false; // can't send until reply
        this.buffer = "";
        this.q_pending = new Queue(); // holds commands to send
        this.q_sent = new Queue(); // holds commands sent
        // event stuff
        this.event = null;
        // initial parser for auth
        /**
         * Description
         * @method parser
         * @return CallExpression
         */
        this.parser = function() {
            return self.bxp.need(["data"], false) //timestamp
        };
    };
    this.reset();

    var connHost = net.createConnection(this.options.port, this.options.host);
    this.bxp = new parser2.parse(connHost);
    //this.bxp.on("data",function(d){console.log("ping",d.toString())});
    this.stream = connHost;
    this._streaming = false; // true while sending stream
    this.stream.on("connect", function() {
        self.state = states.CONNECTING;
        if (exports.debug_mode) {
            console.log(self.tag + ": stream connected");
        }
    });

    this.stream.on("data", function(reply) {
        if (exports.debug_mode) {
            console.log(self.tag + "<<");
            console.dir(reply.toString());
        }
        if (self.state == states.CONNECTED) {
            self.onData()
        } else if (self.state == states.CONNECTING) {
            var read = self.parser();
            if (read) {
            	var nonce,response,code;
            	response=read.data.split(":");
            	if(response.length>1){
            		 // support for digest authentication
            		code = self.options.username + ':' + response[0] + ':' + self.options.password;
            		nonce = response[1];	
            	}else{
            		// support for cram-md5 (Version < 8.0)
            		code = self.options.password;
            		nonce = response[0];	
            	};
            	//console.log("READ",response);
                self.write(self.options.username + "\0");
                var s = md5(md5(code) + nonce);
                self.write(s + "\0");
                self.state = states.AUTHORIZE;
            }
        } else if (self.state == states.AUTHORIZE) {
            var read = self.bxp.popByte()
            if (read) {
                if (read.data != "\0") {
                    //console.log("data",self.bxp.data,"buff: ",self.bxp.buffer)
                    throw "Access denied.";
                }
                self.state = states.CONNECTED;
                if (exports.debug_mode) {
                    console.log(self.tag + ": authorized");
                }
                self.emit("connect", 1);
                self.sendQueueItem();
            }
        } else {
            throw "Bad state: " + self.state;
        }
    });

    /**
     * respond to data arrival
     * @method onData
     * @return
     */
    this.onData = function() {
        // console.log("onData");
        var r, cc = self.current_command;
        while (cc && (r = cc.parser())) {
            if (exports.debug_mode) {
                console.log("response: ", r);
            }
            if (cc.callback) {
                cc.callback(r.ok ? null : r.info, r);
            }

            cc = self.current_command = self.q_sent.shift();
            //console.log("next is:");
            //console.dir(self.current_command);
        }
    };

    this.stream.on("error", socketError);

    this.stream.on("close", function() {
        if (exports.debug_mode) {
            console.log(self.tag + ": stream closed");
        }
        if (self.event) self.event.close()

        if (self.closefn) {
            self.closefn();
            self.closefn = null;
        };
    });

    this.stream.on("end", function() {
        console.log(self.tag + ": stream end");
    });

    this.stream.on("drain", function() {
        // console.log("drain");
    });

    /**
     * send to server
     * @method write
     * @param {} s data to send
     * @return
     */
    this.write = function(s) {
        //console.log("send", typeof s);
        if (s instanceof CombinedStream) {

            s.on('end', function(data) {
                if (exports.debug_mode) {
                    console.log(self.tag + ">>streaming end");
                };
                self.emit("drain")
            });
            if (exports.debug_mode) {
                console.log(self.tag + ">>streaming");
                s.on('data', function(data) {
                    console.dir(data);
                });
            };
            self._streaming = true;

            s.pipe(self.stream, {
                end: false
            });
        } else {
            if (typeof s === "function") s = s();

            if (exports.debug_mode) {
                console.log(self.tag + ">>");
                console.dir(s);
            };
            self.stream.write(s);
        };

    };

    this.on("drain", function() {
        self._streaming = false;
        self.sendQueueItem();
    })

    /**
     * standard parser read 2 lines and byte
     * @method parseResInfo
     * @return  (ok:bool,result:_,info:_) or null if not in buffer
     */
    this.parseResInfo = function() {
        return self.bxp.need(["result", "info"], true)
    };

    /**
     * read status byte
     * @method parseByte
     * @return CallExpression
     */
    this.parseByte = function() {
        return self.bxp.popByte()
    };

    /**
     * read line and byte, if error move result to info
     * @method parser2
     * @return  ok:bool,result:-,info:- or null if not in buffer
     */
    this.parseResult = function() {
        var r = self.bxp.need(["result"], true)
        if (!r) return r;
        return (r.ok) ? r : {
            ok: false,
            info: r.result
        }
    };

    /**
     * add command and returns the result:
     * @method execute
     * @param {} cmd
     * @param {} callback
     * @return
     */
    this.execute = function(cmd, callback) {
        self.send_command({
            send: cmd + "\0",
            parser: self.parseResInfo,
            callback: callback
        });
    };

    /**
     * Returns a query object for the specified query:
     * @method query
     * @param {} query
     * @return NewExpression
     */
    this.query = function(query) {
        return new Query(self, query);
    };

    /**
     * Creates a database from an input stream:
     * @method create
     * @param {} name
     * @param {} input
     * @param {} callback
     * @return
     */
    this.create = function(name, input, callback) {
        self._dbop("\x08", name, input, callback)
    };

    /**
     * Adds a document to the current database from an input stream:
     * @method add
     * @param {} path
     * @param {} input
     * @param {} callback
     * @return
     */
    this.add = function(path, input, callback) {
        self._dbop("\x09", path, input, callback)
    };

    /**
     * Replaces a document with the specified input stream:
     * @method replace
     * @param {} path
     * @param {} input
     * @param {} callback
     * @return
     */
    this.replace = function(path, input, callback) {
        self._dbop("\x0C", path, input, callback)
    };

    /**
     * Stores raw data at the specified path:
     * @method store
     * @param {} path
     * @param {} input
     * @param {} callback
     * @return
     */
    this.store = function(path, input, callback) {
        self._dbop("\x0D", path, input, callback)
    };
    //  input can be stream
    this._dbop = function(op, path, input, callback) {
        var combinedStream = CombinedStream.create();
        combinedStream.append(op + path + "\0");
        combinedStream.append(input);
        combinedStream.append("\0");
        self.send_command({
            send: combinedStream,
            parser: self.parseResult,
            callback: callback
        });
    };

    /**
     * Subscribe to a named event
     * @method watch
     * @param {} name
     * @param {} notification function to call on event
     * @param {} callback for this command
     * @return
     */
    this.watch = function(name, notification, callback) {
        if (self.event === null) { //1st time 
            self.send_command({
                send: "\x0A",
                parser: self.parsewatch,
                /**
                 * Description
                 * @method callback
                 * @return
                 */
                callback: function() {
                    self.event.add(name, notification)
                    // add at front
                    self.send_command({
                        send: name + "\0",
                        parser: self.parsewatch2,
                        callback: callback
                    });
                    self.setBlock(false);
                },
                blocking: true
            })
        } else {
            self.event.add(name, notification)
            self.send_command({
                send: "\x0A" + name + "\0",
                parser: self.parsewatch2,
                callback: callback
            });
        }

    };

    /**
     * parse 1st watch response, expect port,id
     * @method parsewatch
     * @return
     */
    this.parsewatch = function() {
        var flds = self.bxp.need(["eport", "id"], false)
        if (flds) {
            if (self.event === null) {
                self.event = new Watch(self.options.host, flds.eport, flds.id)
                self.event.on("connect", self.onData) //need to wait
            }
            flds.ok = true // expected by reader
            return flds;
        }
    };


    /**
     * parse other watch response
     * @method parsewatch2
     * @return
     */
    this.parsewatch2 = function() {
        // wait info and connected
        //console.log("qqqq",self.event.isConnected)
        //console.log(".....parsewatch2",self.buffer)
        if (self.event.isConnected) return self.bxp.need(["info"], true)
    };

    /**
     * unsubscribe to event
     * @method unwatch
     * @param {} name
     * @param {} callback
     * @return
     */
    this.unwatch = function(name, callback) {
        self.send_command({
            send: "\x0B" + name + "\0",
            parser: selfparseResult,
            /**
             * Description
             * @method callback
             * @param {} err
             * @param {} reply
             * @return
             */
            callback: function(err, reply) {
                self.event.remove(name);
                callback(err, reply);
            }
        });
    };

    /**
     * end the session, sash callback, for stream end
     * @method close
     * @param {} callback
     * @return
     */
    this.close = function(callback) {
        self.closefn = callback;
        self.send_command({
            send: "exit" + "\0",
            parser: self.parseByte
            // sometime get this, timing
        });
    };
    // -------end of commands ---------

    // 
    /**
     * queue a command to server
     * @method send_command
     * @param {} cmd
     * @return
     */
    this.send_command = function(cmd) {
        self.q_pending.push(cmd);
        self.sendQueueItem();
    };

    /**
     * do the next queued command, if any
     * @method sendQueueItem
     * @return boolean true if command was sent
     */
    this.sendQueueItem = function() {
        // console.log("queues waiting send: ",self.q_pending.length,", waiting
        // reply:",self.q_sent.length)

        if (self.q_pending.length === 0 ||
            self._streaming ||
            self.blocked ||
            self.state != states.CONNECTED)
            return false

        var cmd = self.q_pending.shift();
        if (!self.current_command) {
            self.current_command = cmd;
            // console.log("current command: ",cmd.send)

        } else {
            self.q_sent.push(cmd);
        };
        self.write(cmd.send);
        self.setBlock(cmd.blocking ? true : false);
        self.commands_sent += 1;
        return true;
    };

    /**
     * set or clear flag allowing sending to server
     * @method setBlock
     * @param {} state
     * @return
     */
    this.setBlock = function(state) {
        // console.log("blocked:", state)
        self.blocked = state;
        while (self.sendQueueItem()) {};
    };
    events.EventEmitter.call(this);
};

/**
 * Description
 * @method socketError
 * @param {} e
 * @return
 */
function socketError(e) {
    if (e.code == 'ECONNREFUSED') {
        console.log('ECONNREFUSED: connection refused. Check BaseX server is running.');
    } else {
        console.log("SOCKET ERROR: ", e);
    }
}
/**
 * hash str using md5
 * @method md5
 * @param {} str
 * @return md5 value
 */
function md5(str) {
    return crypto.createHash('md5').update(str).digest("hex");
};

util.inherits(Session, events.EventEmitter);
exports.Session = Session;
