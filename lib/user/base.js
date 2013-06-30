var util = require('util');

/**
 * Base user
 * 
 */
function User(config) {

	//Config
	this.config = config;
}

/**
 * Get the config
 */
User.prototype.getConfig = function() {
	return this.config;
};

/**
 * Check a credentials object to see if it has passed authentication
 */
Authentication.prototype.getUser = function(credentials, callback) {
	callback(new Error("This has not been implemented!"));
};

module.exports = User;

