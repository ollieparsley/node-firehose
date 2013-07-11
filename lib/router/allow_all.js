var util = require('util');
var Router = require("./base").Router;

/**
 * Allow all router
 * 
 */
function AllRouter(config) {
	Router.call(this, config);
}
util.inherits(AllRouter, Router);

/**
 * Check a transport
 */
AllRouter.prototype.check = function(transport) {
	return true;
};

/**
 * Get topics
 */
AllRouter.prototype.getTopics = function(transport) {
	return [''];
};

module.exports = {
	Router: AllRouter
}
