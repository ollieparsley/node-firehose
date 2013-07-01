var util = require('util');

/**
 * Base user
 * 
 */
function User(config) {

	//Config
	this.config = config;
	
	//ID
	this.id = null;
	
	//Credentials
	this.credentials = {};
	
	//Data
	this.data = {};
}

/**
 * Get the config
 */
User.prototype.getConfig = function() {
	return this.config;
};

/**
 * Set the ID
 */
User.prototype.setId = function(value) {
	this.id = value;
};

/**
 * Get the id
 */
User.prototype.getId = function() {
	return this.id;
};

/**
 * Set the credentials
 */
User.prototype.setCredentials = function(value) {
	this.credentials = value;
};

/**
 * Get the credentials
 */
User.prototype.getCredentuals = function() {
	return this.credentials;
};

/**
 * Set a data item
 */
User.prototype.set = function(key, value) {
	this.data[key] = value;
};

/**
 * Get the data item
 */
User.prototype.get = function(key) {
	return this.data[key];
};


/**
 * Check a credentials object to see if it has passed authentication
 */
User.prototype.check = function(credentials, callback) {
	callback(new Error("This has not been implemented!"));
};

module.exports = User;

