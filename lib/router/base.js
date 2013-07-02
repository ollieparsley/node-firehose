var util = require('util');

/**
 * Base router
 * 
 */
function Router(config) {
	//Config
	this.config = config;
}

/**
 * Get config
 */
Router.prototype.getConfig = function() {
	return this.config;
};

/**
 * Check a transport
 */
Router.prototype.check = function(transport, callback) {
	callback(new Error("Not implemented"));
};

/**
 * Get topics
 */
Router.prototype.getTopics = function(transport, callback) {
	callback(new Error("Not implemented"));
};

module.exports = {
	Router:    Router
}
