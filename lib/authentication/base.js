var util = require('util');

/**
 * Base auth
 * 
 */
function Authentication(config) {

	//Config
	this.config = config;
}

/**
 * Get the config
 */
Authentication.prototype.getConfig = function() {
	return this.config;
};

/**
 * Check a request object to see if it has passed authentication
 */
Authentication.prototype.getCredentials = function(request, callback) {
	callback(new Error("This has not been implemented!"));
};

module.exports = Authentication;

