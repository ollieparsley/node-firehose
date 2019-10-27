var util = require('util');
var Source = require("./base").Source;
var zmq = require("zeromq");

/**
 * ZeroMQ source
 * Config {"type":"sub","endpoints":["tcp://127.0.0.1:1234","tcp://127.0.0.1:1235"]}
 * 
 */
function ZeroMQSource(config) {
	Source.call(this, config);

	//Config
	this.config = config;
	
	//The socket
	this.socket = null;
	
	//The topics
	this.topics = {};
	
}
util.inherits(ZeroMQSource, Source);

/**
 * Start the source
 */
ZeroMQSource.prototype.start = function() {
	//Create socket
	var config = this.getConfig();
	this.socket = zmq.socket(config.type ? config.type : "sub");
	this.socket.identity = 'node_firehose';
	
	//Connect to all endpoints
	config.endpoints.forEach(function(endpoint) {
		try {
			this.socket.connect(endpoint);
		} catch (e) {
			throw new Error("Could not connect to ZeroMQ endpoint: " + endpoint + " Error: " + e.message);
		}
	}.bind(this));
	
	//Add event listener and emit events on topics
	this.socket.on("message", function(zmqTopic, zmqData) {
		//Convert from buffers to string ready for comparison
		zmqTopic = zmqTopic.toString("utf8");
		if (zmqData) {
			zmqData = zmqData.toString("utf8");
		} else {
			zmqData = "{}";
		}
		
		//Check this topic against the list we have so we emit correctly
		//This is due to zmqs substring matches for topics
		Object.keys(this.topics).forEach(function(topic) {
			//Check the topic appears at the beginning of the zmq received topic
			if (zmqTopic.substring(0, topic.length-1) === topic) {
				this.emit("topic_" + topic, zmqData);
			}
		}.bind(this));
	}.bind(this));
	
};

/**
 * Stop the source
 */
ZeroMQSource.prototype.stop = function() {
	//Close the socket
	this.socket.close();
	
};

/**
 * Add a topic
 */
ZeroMQSource.prototype.addTopic = function(topic) {
	//Subscribe to a topic
	this.topics[topic] = true;
	this.socket.subscribe(topic);
};

/**
 * Remove a topic
 */
ZeroMQSource.prototype.removeTopic = function(topic) {
	//Unsubscribe from topic
	this.topics[topic] = null;
	delete this.topics[topic];
	this.socket.unsubscribe(topic);
};

module.exports = {
	Source: ZeroMQSource
};

