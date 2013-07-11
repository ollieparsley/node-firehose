var util = require('util');
var User = require("../user/base").User;

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
	//Create a user
	var user = new User();
	user.setId("1");
	user.setCredentials(credentials);
	
	//Send the user back
	callback(undefined, user);
};

module.exports = {
	Store: Store
};
