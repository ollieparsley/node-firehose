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
	
	//
	// Add listeners for errors etc (needs base transport to extend event emitter)
	// Then emit standard events for close etc
	//
	//
	
	

}
util.inherits(Client, events.EventEmitter);

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
 * Get the user
 */
Client.prototype.addTopic = function(topic) {
	//Subscribe for updates
	if (this.subscriptions["topic_" + topic] === undefined) { 
		this.subscriptions["topic_" + topic] = function(data){
			//Write to the transport
			this.getTransport().writeItem(topic, data);
		}

		//Subscribe for events on this topic
		this.getSource().on("topic_" + topic, this.subscriptions["topic_" + topic]);
	}
};


module.exports = {
	Client: Client
};

