var util = require('util');
var Source = require("./base").Source;

/**
 * Fake source source
 * 
 */
function FakeSource(config) {
	Source.call(this, config);

	//Config
	this.config = config;
	
	//Topic intervals
	this.topicIntervals = {};
	
}
util.inherits(FakeSource, Source);

/**
 * Start the source
 */
FakeSource.prototype.start = function() {
	//Do nothing. Would be used for setting up connections etc
};

/**
 * Stop the source
 */
FakeSource.prototype.stop = function() {
	//Make sure all topics are remove
	this.topicIntervals.forEach(function(topic){
		this.removeTopic(topic);
	}.bind(this));
};

/**
 * Add a topic
 */
FakeSource.prototype.addTopic = function(topic) {
	if (this.topicIntervals[topic] === undefined) {
		this.topicIntervals[topic] = setInterval(function(){
			this.broadcast(topic, {
				"data": {"foo": "bar"},
				"time": parseInt(new Date().getTime()/ 1000, 10)
			});
		}.bind(this), 2 * 1000);
	}
};

/**
 * Remove a topic
 */
FakeSource.prototype.removeTopic = function(topic) {
	if (this.topicIntervals[topic] !== undefined) {
		clearInterval(this.topicIntervals[topic]);
		this.topicIntervals[topic] = null
		delete this.topicIntervals[topic];
	}
};

module.exports = {
	Source: FakeSource
};

