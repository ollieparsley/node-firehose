var firehose = require("../../index");

//Firehose server options
var options = {
	
	//The base source which sends fake data every 2 seconds
	source: new firehose.Source(),
	
	//An HTTP transport
	transport: {
		//This extends the base server to create an HTTP server
		createServer: require("../lib/http.js").createServer,
		
		//The configuration send to createServer each time it is called
		config: {
			port:                       1338, 
			host:                       "0.0.0.0",
			max_buffer_size:            1048576,
			max_concurrent_connections: 64
		}
	}
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

