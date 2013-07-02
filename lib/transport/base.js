var util = require('util');

/**
 * Base transport
 * 
 */
function Transport(config, authentication) {
	//Config
	this.config = config;
	
	//The authentication to use
	this.authentication = authentication;
	
	//We need to get the user now that we have a connection
	this.user = null;
}

/**
 * Get user
 */
Transport.prototype.getUser = function() {
	return this.user;
};

/**
 * Get config
 */
Transport.prototype.getConfig = function() {
	return this.config;
};

/**
 * Start
 */
Transport.prototype.start = function(success, message, statusCode) {
	throw new Error("Not implemented");
};

/**
 * Get headers
 */
Transport.prototype.getHeaders = function() {
	throw new Error("Not implemented");
};

/**
 * Write item
 */
Transport.prototype.writeItem = function(item) {
	throw new Error("Not implemented");
};

/**
 * Close item
 */
Transport.prototype.close = function(item) {
	throw new Error("Not implemented");
};

/**
 * Send tick
 */
Transport.prototype.sendTick = function() {
	throw new Error("Not implemented");
};

/**
 * Create server
 */
var server = null;
function createServer(config, authentication, callback) {
	throw new Error("Server not implemented");
}

module.exports = {
	createServer: createServer,
	Transport:    Transport
}
