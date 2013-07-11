var util = require('util');
var Source = require("./base").Source;

/**
 * Fake source source
 * 
 */
function FakeSource(config) {
	Source.call(this, config);

	//Config
	this.config = config;
}
util.inherits(FakeSource, Source);

/**
 * Start the source
 */
FakeSource.prototype.start = function() {
	//Set interval to send random data
	this.interval = setInterval(function(){
		this.broadcast("", {
			"data": {"foo": "bar"},
			"time": parseInt(new Date().getTime()/ 1000, 10)
		});
	}.bind(this), 2 * 1000)
};

/**
 * Stop the source
 */
FakeSource.prototype.stop = function() {
	if (this.interval !== null) {
		clearInterval(this.interval);
		this.interval = null;
	}
};

module.exports = {
	Source: FakeSource
};

