var util = require('util');
var Transport = require("./base").Transport;
var WebSocket = require('ws');

/**
 * Websocket transport
 * 
 */
function WebsocketTransport(config, client) {
	Transport.call(this, config);
	
	//Client
	this.client = client;
	
	//Add listener for messages
	this.client.on("message", function(){
		//Read message
	}.bind(this));
	
	//Add listener for close
	this.client.on("close", function(){
		this.close();
	}.bind(this));
	
	//Add listener for error
	this.client.on("error", function(e){
		this.close();
	}.bind(this));
	
	//Closed
	this.closed = false;
	
}
util.inherits(WebsocketTransport, Transport);

/**
 * Get the name for the transport
 */
WebsocketTransport.prototype.getName = function() {
	return "WebSocket";
};

/**
 * Start
 */
WebsocketTransport.prototype.start = function(success, message, statusCode) {
	if (!success) {
		this.sendError(message, statusCode);
	}
};

/**
 * Get headers
 */
WebsocketTransport.prototype.getHeaders = function() {
	return this.client && this.client.request && this.client.request.headers ? this.client.request.headers : {};
};

/**
 * Send item
 */
WebsocketTransport.prototype.sendItem = function(topic, item) {
	this.write(item);
};

/**
 * Send error
 */
WebsocketTransport.prototype.sendError = function(message, statusCode) {
	this.write(JSON.stringify({"message": message}));
	this.close();
};

/**
 * Write item
 */
WebsocketTransport.prototype.write = function(item) {
	if (this.client.readyState === WebSocket.OPEN) {
        this.client.send(data);
    }
};

/**
 * Close item
 */
WebsocketTransport.prototype.close = function() {
	if (!this.closed) {
		this.closed = true;
		this.client.close();
	}
	this.emit("close");
};

/**
 * Send tick
 */
WebsocketTransport.prototype.sendTick = function() {
	var topic = '';
	this.sendItem(topic, JSON.stringify({"tick": parseInt(new Date().getTime() / 1000, 10)}));
};

/**
 * Get socket
 */
WebsocketTransport.prototype.getSocket = function() {
	return this.client && this.client.socket ? this.client.socket : false;
};

/**
 * Get the path used in the request
 */
Transport.prototype.getPath = function() {
	return this.request && this.request.url ? this.request.url : false;
};

/**
 * Create server
 */
function createServer(config, callback) {
	//Check config
	if (!config.port) {
		throw new Error("No port specified in transport config");
	}
	
	var server = new WebSocket.Server({
		port: config.port
	});

	//Listen for websocket connections
	server.on('connection', function (client) {
		//Create an instance of the transport
		callback(new WebsocketTransport(config, client));
	});
	
	//Return an object that will allow the user to start listening when they want
	return {
		listen: function(callback) {
			// N/A
		},
		close: function(callback) {
			server.close(callback);
		}
	}
	
};

module.exports = {
	createServer: createServer,
	Transport:    WebsocketTransport
}
