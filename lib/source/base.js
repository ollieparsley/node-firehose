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
 * Start the source
 */
Source.prototype.start = function() {
	//Set interval to send random data
	this.interval = setInterval(function(){
		this.emit("topic_", {
			"data": {"foo": "bar"},
			"time": parseInt(new Date().getTime()/ 1000, 10)
		});
	}.bind(this), 2 * 1000)
};

/**
 * Stop the source
 */
Source.prototype.stop = function() {
	if (this.interval !== null) {
		clearInterval(this.interval);
		this.interval = null;
	}
};

module.exports = {
	Source: Source
};

