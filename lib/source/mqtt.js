var util = require('util');
var Source = require("./base").Source;
var mqtt = require("mqtt");

/**
 * MQTT source
 * Config {"broker":{"port":1245,"host":"127.0.0.1"}}
 * 
 */
function MQTTSource(config) {
	Source.call(this, config);

	//Config
	this.config = config;
	
	//The client
	this.client = null;
	
	//The topics
	this.topics = {};
	
}
util.inherits(MQTTSource, Source);

/**
 * Start the source
 */
MQTTSource.prototype.start = function() {
	//Create socket
	var config = this.getConfig();
	
	//Create the client
	this.client = mqtt.createClient(config.broker.port, config.broker.host, config.options);

	//Add client connect event
	this.client.on("connect", function() {
		console.log("MQTT client connected");
	}.bind(this));
	this.client.on("error", function(error) {
		console.log("MQTT error: ", error);
	}.bind(this));
	
	//Add event listener and emit events on topics
	this.client.on("message", function(mqttTopic, mqttMessage) {
		//Convert from buffers to string ready for comparison
		mqttTopic = mqttTopic.toString("utf8");
		if (mqttMessage) {
			mqttMessage = mqttMessage.toString("utf8");
		} else {
			mqttMessage = "{}";
		}
		
		//Emit the message
		this.emit("topic_" + mqttTopic, JSON.parse(mqttMessage));
		
	}.bind(this));
	
};

/**
 * Stop the source
 */
MQTTSource.prototype.stop = function() {
	//Close the client
	this.client.end();
};

/**
 * Add a topic
 */
MQTTSource.prototype.addTopic = function(topic) {
	//Subscribe to a topic
	this.client.subscribe(topic);
};

/**
 * Remove a topic
 */
MQTTSource.prototype.removeTopic = function(topic) {
	//Unsubscribe from topic
	this.client.unsubscribe(topic);
};

module.exports = {
	Source: MQTTSource
};

