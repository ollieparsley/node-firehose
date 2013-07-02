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
CustomRouter.prototype.check = function(transport, callback) {
	
	//Get the path from the transport
	var found = false;
	this.routes.forEach(function(path) {
		if (!found && path === transport.getPath()) {
			found = true;
			callback(undefined, true);
		}
	})
	
	//Path was not found
	callback(new Error("Not found"));
};

/**
 * Get topics
 */
CustomRouter.prototype.getTopics = function(transport, callback) {
	callback(undefined, []);
};

module.exports = {
	Router:    CustomRouter
}
