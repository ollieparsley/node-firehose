var util = require("util");
var Authentication = require("../index").Authentication;

/**
 * No authentication
 * 
 */
function NoAuthentication(config) {
	Authentication.call(this, config);
}
util.inherits(NoAuthentication, Authentication);

/**
 * Check a request object to see if it has passed authentication
 */
NoAuthentication.prototype.getCredentials = function(transport, callback) {
	callback(undefined, {});
};

module.exports = {
	Authentication: NoAuthentication
};

