var util = require('util');
var Transport = require("../index").Transport;

/**
 * HTTP transport
 * 
 */
function HttpTransport(config, authentication, request, response) {
	Transport.call(this, config, authentication);
	
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
		"X-ServedBy": "node-firehose"
	};
	
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
		this.response.writeHead(statusCode, this.headers);
		this.response.writeItem({"errors": [{code: statusCode, message: message}]});
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
 * Write item
 */
HttpTransport.prototype.writeItem = function(item) {
	this.response.write(JSON.stringify(item) + "\r\n");
};

/**
 * Close item
 */
HttpTransport.prototype.close = function() {
	if (!this.closed) {
		this.closed = true;
		this.response.close();
	}
};

/**
 * Send tick
 */
HttpTransport.prototype.sendTick = function() {
	this.writeItem({"tick": parseInt(new Date().getTime() / 1000, 10)});
};

/**
 * Create server
 */
function createServer(options, config, store, authentication, callback) {
	//Create the http server
	var server = require("http").createServer(function(request, response){
		//Create an instance of the transport
		var transport = new HttpTransport(config, request, response);
		
		
		
		
		callback(new HttpTransport(config, authentication, request, response));		
	});
	
	//Return an object that will allow the user to start listening when they want
	return {
		listen: function(callback) {
			server.listen(
				config.port ? config.port : 8080,     //Specify the port
				config.host ? config.host : callback, //Specify the host or just the callback if the host is not specified
				config.host ? callback : undefined    //Specify the callback if the host is specified
			);
		}
	}
	
	
};

module.exports = {
	createServer: createServer,
	Transport:    HttpTransport
}
