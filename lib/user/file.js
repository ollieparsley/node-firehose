var util = require("util");
var User = require("./base");

/**
 * File based user storage
 * 
 */
function FileUser(config) {
	User.call(this, config);
	
	//Users
	this.users = {};
	
	//Load the auth file into the user list
	fs.readFileSync(process.cwd() + this.getConfig().path).toString().split('\n').forEach(function (line) { 
		if (line.length > 1) {
			var credentials = line.split(":");
			if (credentials.length) {
				this.users[credentials[0].toLowerCase()] = credentials[1];
			}
		}
	}.bind(this));
	
	
}
util.inherits(FileUser, User);

/**
 * Check a credentials object to see if it has passed authentication
 */
FileUser.prototype.getUser = function(credentials, callback) {
	//Check the credentials exist
	if (!credentials.username || !credentials.password) {
		return callback(new Error("Username and password are required"));
	}
	
	//Check the username exists
	var password = this.users[credentials.username.toLowerCase()];
	if (!password) {
		return callback(new Error("User not found"));
	}
	
	//Check the password is correct
	if (password !== credentials.password) {
		return callback(new Error("Password is incorrect"));
	}
	
	//Return the credentials as that is all we know about the user
	callback(undefined, credentials);
};

module.exports = FileUser;
