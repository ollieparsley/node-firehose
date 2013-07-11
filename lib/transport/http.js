var util = require('util');
var Transport = require("./base").Transport;

/**
 * HTTP transport
 * 
 */
function HttpTransport(config, request, response) {
	Transport.call(this, config);
	
	//Request
	this.request = request;
	
	//Response
	this.response = response;
	
	//Add listener
	this.response.on("close", function(){
		this.close();
	}.bind(this));
	this.response.on("end", function(){
		this.close();
	}.bind(this));
	this.response.on("error", function(){
		this.close();
	}.bind(this));
	
	//Headers
	this.headers = {
		"Content-Type": "application/json",
		"X-Served-By":  "node-firehose"
	};
	
	//Header sent
	this.headersSent = false;
	
	//Closed
	this.closed = false;
	
}
util.inherits(HttpTransport, Transport);

/**
 * Get the name for the transport
 */
HttpTransport.prototype.getName = function() {
	return "HTTP";
};

/**
 * Start
 */
HttpTransport.prototype.start = function(success, message, statusCode) {
	if (success) {
		this.response.writeHead(200, this.headers);
	} else {
		this.response.sendError(message, statusCode);
		this.response.close();
	}
	throw new Error("Not implemented");
};

/**
 * Get headers
 */
HttpTransport.prototype.getHeaders = function() {
	return this.request && this.request.headers ? this.request.headers : {};
};

/**
 * Send item
 */
HttpTransport.prototype.sendItem = function(topic, item) {
	this.write(item);
};

/**
 * Send error
 */
HttpTransport.prototype.sendError = function(message, statusCode) {
	this.sendHeaders(statusCode ? statusCode : 500, this.headers);
	this.write({"message": message});
};

/**
 * Send headers
 */
HttpTransport.prototype.sendHeaders = function(statusCode, headers) {
	if (!this.headersSent) {
		this.headersSent = true;
		this.response.writeHead(statusCode, headers);
	}
};

/**
 * Write item
 */
HttpTransport.prototype.write = function(object) {
	this.sendHeaders(200, this.headers);
	this.response.write(JSON.stringify(object) + "\r\n");
};

/**
 * Close item
 */
HttpTransport.prototype.close = function() {
	if (!this.closed) {
		this.closed = true;
		this.response.end();
	}
	this.emit("close");
};

/**
 * Send tick
 */
HttpTransport.prototype.sendTick = function() {
	var topic = '';
	this.sendItem(topic, {"tick": parseInt(new Date().getTime() / 1000, 10)});
};

/**
 * Get socket
 */
HttpTransport.prototype.getSocket = function() {
	return this.response && this.response.socket ? this.response.socket : false;
};

/**
 * Create server
 */
function createServer(config, callback) {
	//Create the http server
	var server = require("http").createServer(function(request, response){
		
		//Check config
		if (!config.host) {
			throw new Error("No host specified in transport config");
		} else if (!config.port) {
			throw new Error("No port specified in transport config");
		}
		
		//Create an instance of the transport
		callback(new HttpTransport(config, request, response));		
	});
	
	//Return an object that will allow the user to start listening when they want
	return {
		listen: function(callback) {
			server.listen(
				config.port ? config.port : 8080,     //Specify the port
				config.host ? config.host : callback, //Specify the host or just the callback if the host is not specified
				config.host ? callback : undefined    //Specify the callback if the host is specified
			);
		},
		close: function(callback) {
			server.close(callback);
		}
	}
	
};

module.exports = {
	createServer: createServer,
	Transport:    HttpTransport
}
