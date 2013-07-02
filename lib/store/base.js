var util = require('util');

/**
 * Base store
 * 
 */
function Store(config) {
	//Config
	this.config = config;
}

/**
 * Get the config
 */
Store.prototype.getConfig = function() {
	return this.config;
};

/**
 * Get a user using credentials
 */
Store.prototype.getUserFromCredentials = function(credentials, callback) {
	callback(new Error("Not implemented"));
};

module.exports = {
	Store: Store
};
