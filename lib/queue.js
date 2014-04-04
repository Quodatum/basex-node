// Queue class adapted from Tim Caswell's pattern library
// https://github.com/creationix/pattern/blob/master/queue.js
/**
 * Description
 * @method to_array
 * @param {} args
 * @return arr
 */
function to_array(args) {
    var len = args.length,
        arr = new Array(len), i;

    for (i = 0; i < len; i += 1) {
        arr[i] = args[i];
    }

    return arr;
};
/**
 * Queue class
 * @constructor Queue
 * @return 
 */
var Queue = function () {
    this.tail = [];
    this.head = to_array(arguments);
    this.offset = 0;
};

/**
 * Description
 * @method shift
 * @return MemberExpression
 */
Queue.prototype.shift = function () {
    if (this.offset === this.head.length) {
        var tmp = this.head;
        tmp.length = 0;
        this.head = this.tail;
        this.tail = tmp;
        this.offset = 0;
        if (this.head.length === 0) {
            return;
        }
    }
    return this.head[this.offset++]; // sorry, JSLint
};


/**
 * Description
 * @method push
 * @param {} item
 * @return CallExpression
 */
Queue.prototype.push = function (item) {
    return this.tail.push(item);
};

/**
 * Description
 * @method forEach
 * @param {} fn
 * @param {} thisv
 * @return array
 */
Queue.prototype.forEach = function (fn, thisv) {
    var array = this.head.slice(this.offset), i, il;

    array.push.apply(array, this.tail);

    if (thisv) {
        for (i = 0, il = array.length; i < il; i += 1) {
            fn.call(thisv, array[i], i, array);
        }
    } else {
        for (i = 0, il = array.length; i < il; i += 1) {
            fn(array[i], i, array);
        }
    }

    return array;
};

Object.defineProperty(Queue.prototype, 'length', {
    /**
     * Description
     * @method get
     * @return BinaryExpression
     */
    get: function () {
        return this.head.length - this.offset + this.tail.length;
    }
});

exports.Queue = Queue;
