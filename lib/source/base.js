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
	//Do nothing
};

/**
 * Stop the source
 */
Source.prototype.stop = function() {
	//Do nothing
};

/**
 * Broadcast data on a topic
 */
Source.prototype.broadcast = function(topic, data) {
	this.emit("topic_" + topic, data);
};

module.exports = {
	Source: Source
};

