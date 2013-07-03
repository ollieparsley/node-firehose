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
Router.prototype.check = function(transport) {
	return true;
};

/**
 * Get topics
 */
Router.prototype.getTopics = function(transport, callback) {
	callback(undefined, ['']);
};

module.exports = {
	Router: Router
}
