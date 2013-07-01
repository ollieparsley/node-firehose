var util = require('util');
var Transport = require('./base').Transport;

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
 * Start
 */
Transport.prototype.start = function(success, message, statusCode) {
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
var server = null;
function createServer(config, authentication, callback) {
	//Create the http server
	server = require("http").createServer(function(request, response){
		//Create transport and the user
		callback(new HttpTransport(config, authentication, request, response));		
	});
	
	//Listen
	server.listen(config.port ? config.port : 8080, config.host ? config.host : undefined);
};

module.exports = {
	createServer: createServer,
	Transport:    HttpTransport
}
