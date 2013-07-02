var util = require('util');
var Router = require("../index").Router;

/**
 * Allow-all router
 * 
 */
function AllRouter(config) {
	Router.call(this, config);
}
util.inherits(AllRouter, Router);

/**
 * Check a transport
 */
AllRouter.prototype.check = function(transport, callback) {
	callback(undefined, true);
};

/**
 * Get topics
 */
AllRouter.prototype.getTopics = function(transport, callback) {
	callback(undefined, []);
};

module.exports = {
	Router:    AllRouter
}
