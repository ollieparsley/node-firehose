var util = require('util');
var Source = require("./base").Source;
var Tail = require("tail").Tail;

/**
 * File source
 * Config {"base_path":"/tmp/firehose_", "file_extension":"log"}
 * 
 */
function FileSource(config) {
	Source.call(this, config);

	//Config
	this.config = config;
	
	//The files
	this.files = {};
	
}
util.inherits(FileSource, Source);

/**
 * Start the source
 */
FileSource.prototype.start = function() {
	//Do nothing
};

/**
 * Stop the source
 */
FileSource.prototype.stop = function() {
	//Close each file
	Object.keys(this.files).forEach(function(fileName) {
		var tail = this.files[fileName];
		tail.unwatch();
		this.files[fileName] = null;
		delete this.files[fileName];
	}.bind(this));
};

/**
 * Add a topic
 */
FileSource.prototype.addTopic = function(topic) {
	//Subscribe to a topic if is not subscribe to already
	if (this.files[topic] === undefined) {
		var config = this.getConfig();
		var tail = new Tail(config.base_path + topic + (config.file_extension ? "." + config.file_extension : ""));
		tail.on("line", function(data) {
			this.emit("topic_" + topic, data.toString("utf8"));
		}.bind(this));
		this.files[topic] = tail;
	}
};

/**
 * Remove a topic
 */
FileSource.prototype.removeTopic = function(topic) {
	//Unsubscribe from topic
	if (this.files[topic] !== undefined) {
		this.files[topic].removeAllListeners();
		this.files[topic] = null;
		delete this.files[topic];
	}
};

module.exports = {
	Source: FileSource
};

