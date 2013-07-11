var firehose = require("../../index");
var path = require('path');

//Firehose server options
var options = {
	config: {
		max_buffer_size:            1048576,
		max_concurrent_connections: 1024,
		transport:                  {
			port: 1337, 
			host: "0.0.0.0"
		}
	},
	
	//The base source which sends fake data every 2 seconds
	source: new firehose.source.Fake(),
	
	//An HTTP transport
	transport: firehose.transport.Http,
	
	//Basic authentication
	authentication: new firehose.authentication.Basic(),
	
	//JSON file store
	store: new firehose.store.JsonFile({
		path: path.resolve(__dirname, 'users.json')
	})
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
server.listen();

