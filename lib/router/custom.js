var util = require('util');
var Router = require("../index").Router;

/**
 * Custom router
 * 
 */
function CustomRouter(config) {
	Router.call(this, config);
	
	//Routes
	this.routes = [
		'/1/firehose.json'
	]
	
}
util.inherits(CustomRouter, Router);

/**
 * Check a transport
 */
CustomRouter.prototype.check = function(transport) {
	
	//Get the path from the transport
	var found = false;
	this.routes.forEach(function(path) {
		if (!found && path === transport.getPath()) {
			found = true;
		}
	});
	
	//Path was not found
	return found ? true : false;
};

/**
 * Get topics
 */
CustomRouter.prototype.getTopics = function(transport) {
	return [''];
};

module.exports = {
	Router:    CustomRouter
}
