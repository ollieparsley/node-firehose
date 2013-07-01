var util = require("util");
var User = require("./base");

/**
 * No user storage
 * 
 */
function NoUser(config) {
	User.call(this, config);
}
util.inherits(NoUser, User);

/**
 * Check a credentials object to see if it has passed authentication
 */
NoUser.prototype.check = function(credentials, callback) {
	//Return the credentials as that is all we know about the user
	callback(undefined, credentials);
};

module.exports = NoUser;
