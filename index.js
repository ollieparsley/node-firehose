var firehose = {
	authentication: {
		Base:     require("./lib/authentication/base").Authentication,
		Basic:    require("./lib/authentication/basic").Authentication,
		AllowAll: require("./lib/authentication/allow_all").Authentication
	},
	router: {
		Base:     require("./lib/router/base").Router,
		AllowAll: require("./lib/router/allow_all").Router
	},
	source: {
		Base:     require("./lib/source/base").Source,
		Fake:     require("./lib/source/fake").Source,
		ZeroMQ:   require("./lib/source/zeromq").Source,
		MQTT:     require("./lib/source/mqtt").Source,
		File:     require("./lib/source/file").Source
	},
	store: {
		Base:     require("./lib/store/base").Store,
		JsonFile: require("./lib/store/json_file").Store
	},
	transport: {
		Base:     require("./lib/transport/base"),
		Http:     require("./lib/transport/http"),
		Websocket: require("./lib/transport/websocket")
	},
	user: {
		Base:     require("./lib/user/base").User
	},
	client: {
		Base:     require("./lib/client/base").Client
	},
	createServer:   createServer
};

function createServer(options, callback) {
	
	//Check the source
	if (!options.source) {
		throw new Error("A source needs to be set");
	} else if (!(options.source instanceof firehose.source.Base)) {
		throw new Error("The source must be an instance of Source");
	}
	
	//Check the transport
	//console.log("\n\n", options.transport.Transport, firehose.transport.Base.Transport, "\n\n");
	//process.exit();
	if (!options.transport) {
		throw new Error("A transport needs to be set");
	} else if (!options.transport.createServer) {
		throw new Error("The transport must have a createServer method");
	}

	//Check the router
	if (!options.router) {
		//Choose a router that allows all through
		options.router = new firehose.router.AllowAll();
	} else if (!(options.router instanceof firehose.router.Base)) {
		throw new Error("The router must be an instance of Router");
	}
	
	//Check the authentication
	if (!options.authentication) {
		//Choose the default authentication
		options.authentication = new firehose.authentication.Base();
	} else if (!(options.authentication instanceof firehose.authentication.Base)) {
		throw new Error("The authentication must be an instance of Authentication");
	}
	
	//Check the store
	if (!options.store) {
		options.store = new firehose.store.Base();
	} else if (!(options.store instanceof firehose.store.Base)) {
		throw new Error("The store must be an instance of Store");
	}
	
	//Start the source
	options.source.start();
	
	//Clients
	var clients = {};
	
	//Topics - ref counts
	var topics = {};
	
	//Ticks
	var tickIntervalSeconds = options.config && options.config.tick_interval ? options.config.tick_interval : 30.
	var tickInterval = setInterval(function(){
		var now = parseInt(new Date().getTime() / 1000);
		Object.keys(clients).forEach(function(clientId){
			var client = clients[clientId];
			if (now - client.lastItem > tickIntervalSeconds) {
				//Client hasn't received data for over x seconds so send a tick
				client.getTransport().sendTick();
			}
		});
	}, tickIntervalSeconds * 1000);
	
	//If we have a max buffer size confit then check it every 10 seconds
	var bufferCheckInterval = null;
	if (options.config && options.config.max_buffer_size) {
		bufferCheckInterval = setInterval(function(){
			Object.keys(clients).forEach(function(clientId){
				var client = clients[clientId];
				var transport = client.getTransport();
				if (transport) {
					var socket = transport.getSocket();
					if (socket && socket.bufferSize && socket.bufferSize > options.config.max_buffer_size) {
						client.sendError("You are consuming too slowy and have been disconnected", 400)
					}
				}
			});
		}, 10 * 1000);
	}
	
	//Now create the transport server
	var transportServer = options.transport.createServer(options.config.transport, function(transport) {
		//Check to see if we are the max connections
		if (options.config && options.config.max_concurrent_connections <= Object.keys(clients).length) {
			//We are at capacity
			transport.sendError("The service has reached capacity", 503);
			transport.close();
			return;
		}
		
		//Check we have a route match
		if (!options.router.check(transport)) {
			transport.sendError("Not found", 404);
			transport.close();
			return;
		}
		
		//Now check the authentication
		var credentials = options.authentication.getCredentials(transport);
		if (credentials instanceof Error) {
			transport.sendError("Not authorized", 401);
			transport.close();
			return;
		}
		
		//Get the user using the credentials
		options.store.getUserFromCredentials(credentials, function(error, user){
			
			//Check if we have an error
			if (error) {
				transport.sendError(error.message, 401);
				transport.close();
				return;
			}
			
			//Create a new client
			var client = new firehose.client.Base(transport, options.source, user);
			
			//Add client to client list
			clients[client.getId()] = client;
			
			//Remove client from list
			client.on("close", function(){
				clients[client.getId()] = null;
				delete clients[client.getId()];
			});
			
			//Client added a topic
			client.on("add_topic", function(topic){
				console.log("Client added topic: " + topic);
				if (topics[topic] === undefined) {
					//Add the topic to the list
					topics[topic] = {count:1};
					
					//New topic so tell the source to add it
					options.source.addTopic(topic);
				} else {
					//Increment the ref count
					topics[topic].count++;
				}
			});
			
			//Client removed a topic
			client.on("remove_topic", function(topic){
				console.log("Client removed topic: " + topic);
				//Check if we have the topic at all
				if (topics[topic] === undefined) {
					return;
				}
				
				//Decrement
				topics[topic].count--;
				
				//Check if none left
				if (topics[topic].count <= 0) {
					//Remove the topic as there is nothing listening
					options.source.removeTopic(topic);
				}
			});
			
			//Get topics from initial connection
			var topics = options.router.getTopics(transport);
			topics.forEach(function(topic){
				//Add subscriptions for client
				client.addTopic(topic);
			});

			//From the transport get a user
			callback(client)
		});	
		
	});
	
	//Return an object so they can call the listen method
	return {
		listen: function(listenCallback) {
			if (transportServer && transportServer.listen) {
				transportServer.listen(listenCallback);
			} else {
				listenCallback();
			}
		},
		close: function(){
			//Stop the source
			options.source.stop();
			
			//Close the server itself
			transportServer.close();
			
			//Stop the buffer check
			if (bufferCheckInterval !== null) {
				clearInterval(bufferCheckInterval);
			}
			
			//Clear tick interval
			if (tickInterval !== null) {
				clearInterval(tickInterval);
			}
		},
		clients: clients
	};
}

exports = module.exports = firehose;