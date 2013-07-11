var util = require('util');
var Router = require("../index").Router;

/**
 * Custom router
 * 
 */
function TwitterRouter(config) {
	Router.call(this, config);
	
	//Routes
	this.routes = {
		'/1/firehose.json': 'firehose',
		'/1/sample.json':   'sample'
	};
	
}
util.inherits(TwitterRouter, Router);

/**
 * Check a transport
 */
TwitterRouter.prototype.check = function(transport) {
	return this.getTopicFromPath(transport.getPath()) ? true : false;
};

/**
 * Get topics
 */
TwitterRouter.prototype.getTopics = function(transport) {
	var topic = this.getTopicFromPath(transport.getPath());
	return topic ? [topic] : [];
};

/**
 * Get topics
 */
TwitterRouter.prototype.getTopicFromPath = function(transportPath) {
	//Get the path from the transport
	var chosenTopic = undefined;
	Object.keys(this.routes).forEach(function(path) {
		var topic = this.routes[path];
		if (!chosenTopic && path === transportPath) {
			chosenTopic = topic;
		}
	}.bind(this));
	
	//Path was not found
	return chosenTopic ? chosenTopic : false;
};

module.exports = {
	Router: TwitterRouter
}
