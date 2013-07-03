var util = require('util');
var events = require('events');

/**
 * Base source
 * 
 */
function Source(config) {
	events.EventEmitter.call(this);

	//Config
	this.config = config;
}
util.inherits(Source, events.EventEmitter);

/**
 * Get the config
 */
Source.prototype.getConfig = function() {
	return this.config;
};

/**
 * Check a request object to see if it has passed authentication
 */
Source.prototype.start = function(transport) {
	//Set interval to send random data
	setInterval(function(){
		this.emit("topic_", {
			"data": {"foo": "bar"},
			"time": parseInt(new Date().getTime()/ 1000, 10)
		});
	}.bind(this), 2 * 1000)
};

module.exports = {
	Source: Source
};

