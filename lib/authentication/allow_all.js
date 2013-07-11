var util = require("util");
var Authentication = require("./base").Authentication;

/**
 * Allow all auth
 * 
 */
function AllowAllAuthentication(config) {
	Authentication.call(this, config);
}
util.inherits(AllowAllAuthentication, Authentication);

/**
 * Check a request object to see if it has passed authentication
 */
AllowAllAuthentication.prototype.getCredentials = function(transport) {
	return {};
};

module.exports = {
	Authentication: AllowAllAuthentication
};

