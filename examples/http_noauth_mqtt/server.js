var firehose = require("../../index"); //This would be require("firehose");

//Firehose server options
var options = {
	//Config
	config: {
		max_buffer_size:            1048576,
		max_concurrent_connections: 1024,
		transport:                  {
			port: 1337, 
			host: "0.0.0.0"
		}
	},
	
	//The source creates a sub socket and connects to all endpoints in the array
	source: new firehose.source.MQTT({
		qos: 1,
		broker: {
			"host": "127.0.0.1",
			"port": 1245
		}
	}),
	
	//An HTTP transport
	transport: firehose.transport.Http
};

//Create server, send the options and wait for a client to successfully connect
var server = firehose.createServer(options, function(client) {
	console.log("New client (" + client.getId() + ") has connected. Now there are " + Object.keys(server.clients).length + " clients");
	
	//Listen for client disconnects
	client.on("close", function() {
		console.log("Client (" + client.getId() + ") has disconnected")
	});
	
});

//Start the server listening
server.listen(function(){
	console.log ("Firehose server is now listening");
});

