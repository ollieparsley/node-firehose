var util = require('util');
var events = require('events');

/**
 * Base client
 * 
 */
function Client(transport, source, user) {
	events.EventEmitter.call(this);

	//Transport
	this.transport = transport;
	
	//User
	this.user = user;
	
	//Source
	this.source = source;
	
	//Subscriptions
	this.subscriptions = {};
	
	//Id
	this.id = new Date().getTime().toString();
	
	//Start listening for transport events
	this.transport.on("close", function(){
		this.close();
	}.bind(this));
	
	//
	// Add listeners for errors etc (needs base transport to extend event emitter)
	// Then emit standard events for close etc
	//
	//
	
}
util.inherits(Client, events.EventEmitter);

/**
 * Get the id
 */
Client.prototype.getId = function() {
	return this.id;
};

/**
 * Get the transport
 */
Client.prototype.getTransport = function() {
	return this.transport;
};

/**
 * Get the source
 */
Client.prototype.getSource = function() {
	return this.source;
};

/**
 * Get the user
 */
Client.prototype.getUser = function() {
	return this.user;
};

/**
 * Get the topics
 */
Client.prototype.getTopics = function() {
	return Object.keys(this.subscriptions);
};

/**
 * Add a topic
 */
Client.prototype.addTopic = function(topic) {
	//Subscribe for updates
	if (this.subscriptions["topic_" + topic] === undefined) { 
		this.subscriptions["topic_" + topic] = function(data){
			//Write to the transport
			this.getTransport().sendItem(topic, data);
		}.bind(this);

		//Subscribe for events on this topic
		this.getSource().on("topic_" + topic, this.subscriptions["topic_" + topic]);
	}
};

/**
 * Remove all topics
 */
Client.prototype.removeAllTopics = function(topic) {
	
	Object.keys(this.subscriptions).forEach(function(topic_key){
		var subscription = this.subscriptions[topic_key];
		this.getSource().removeListener(topic_key, subscription);
	}.bind(this));

};

/**
 * Get the user
 */
Client.prototype.close = function() {
	this.emit("close");
	
	//Unsubscribe from topics
	this.removeAllTopics();
};


module.exports = {
	Client: Client
};

