var util = require("util");
var Authentication = require("../index").Authentication;

/**
 * Basic auth auth
 * 
 */
function BasicAuthentication(config) {
	Authentication.call(this, config);
}
util.inherits(BasicAuthentication, Authentication);

/**
 * Check a request object to see if it has passed authentication
 */
BasicAuthentication.prototype.getCredentials = function(transport, callback) {
	//Extract the headers from the request
	var headers = transport.getHeaders();
	var headerValue = headers["authorization"];
	if (!headerValue) {
		return callback(new Error("No header Authorization header was set"));
	}
	
	//Now check the format
	if (headerValue.substr(0, 6) !== "Basic ") {
		return callback(new Error("Authorization header was not the correct format"));
	}
	
	//Now get the username and password
	var encodedCredentials = headerValue.substr(6);
	var credentials = atob(encodedCredentials);
	
	//Now check to see if the credentials contains a colon
	if (credentials.indexOf(":") < 0) {
		return callback(new Error("Credentials were not encoded properly"));
	}
	
	//Now extract the username and password
	var credentialArray = credentials.split(":");
	callback(undefined, {username:credentialArray[0], password:credentialArray[1]});

};

module.exports = {
	Authentication: BasicAuthentication
};

