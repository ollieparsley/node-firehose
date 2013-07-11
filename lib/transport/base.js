var util = require('util');
var events = require('events');

/**
 * Base transport
 * 
 */
function Transport(config) {
	events.EventEmitter.call(this);
	
	//Config
	this.config = config;
	
	//We need to get the user now that we have a connection
	this.user = null;
}
util.inherits(Transport, events.EventEmitter);

/**
 * Get the name for the transport
 */
Transport.prototype.getName = function() {
	return "Base";
};

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
Transport.prototype.sendItem = function(topic, item) {
	throw new Error("Not implemented");
};

/**
 * Send error
 */
Transport.prototype.sendError = function(message, statusCode) {
	throw new Error("Not implemented");
};

/**
 * Close item
 */
Transport.prototype.close = function(item) {
	this.emit("close");
};

/**
 * Send tick
 */
Transport.prototype.sendTick = function() {
	throw new Error("Not implemented");
};

/**
 * Get socket
 */
Transport.prototype.getSocket = function() {
	throw new Error("Not implemented");
};

/**
 * Get the path used in the request
 */
Transport.prototype.getPath = function() {
	throw new Error("Not implemented");
};

/**
 * Create server
 */
function createServer(config, callback) {
	throw new Error("Server not implemented");
}

module.exports = {
	createServer: createServer,
	Transport:    Transport
}
