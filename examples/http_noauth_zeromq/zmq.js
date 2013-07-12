//Test script that will send a ZMQ message a few times a second
var zmq = require("zmq");
var socket = zmq.createSocket("pub");
var endpoint = "tcp://127.0.0.1:1234";
socket.bind(endpoint, function(){
	console.log("Bound to " + endpoint);
	setInterval(function(){
		socket.send(["firehose", '{"some_data":' + (new Date().getTime()) + '}']);
	}, 500);
});