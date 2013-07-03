var firehose = {
	Authentication: require("./lib/authentication/base").Authentication,
	Client:         require("./lib/user/base").Client,
	Router:         require("./lib/router/base").Router,
	Source:         require("./lib/source/base").Source,
	Store:          require("./lib/store/base").Store,
	Transport:      require("./lib/transport/base").Transport,
	User:           require("./lib/user/base").User,
	createServer:   createServer
};

module.exports = firehose;

function createServer(options, callback) {
	
	//Check the source
	if (!options.source) {
		throw new Error("A source needs to be set");
	} else if (!(options.source instanceof firehose.Source)) {
		throw new Error("The source must be an instance of Source");
	}
	
	//Check the transport
	if (!options.transport) {
		throw new Error("A transport needs to be set");
	}
	
	//Check the router
	if (!options.router) {
		//Choose a router that allows all through
		options.router = new firehose.Router();
	} else if (!(options.router instanceof firehose.Router)) {
		throw new Error("The router must be an instance of Router");
	}
	
	//Check the authentication
	if (!options.authentication) {
		//Choose the default authentication
		options.authentication = new firehose.Authentication();
	} else if (!(options.authentication instanceof firehose.Authentication)) {
		throw new Error("The authentication must be an instance of Authentication");
	}
	
	//Check the store
	if (!options.store) {
		options.store = new firehose.Store();
	} else if (!(options.store instanceof firehose.Store)) {
		throw new Error("The store must be an instance of Store");
	}
	
	//Start the source
	options.source.start();
	
	//Now create the transport server
	var transportServer = options.transport.class.createServer(options.transport.config, function(transport) {
		
		//Check we have a route match
		if (!options.router.check(transport)) {
			transport.sendError("Not found", 404);
			transport.close();
			return;
		}
		
		//Now check the authentication
		var credentials = options.authentication.getCredentials(transport);
		if (!credentials) {
			transport.sendError("Not authorized", 401);
			transport.close();
			return;
		}
		
		//Get the user using the credentials
		options.store.getUserFromCredentials(credentials, function(error, user){
			
			//Check if we have an error
			if (error) {
				transport.sendError(error.message, 400);
				transport.close();
				return;
			}
			
			//Create a new client
			var client = new firehose.Client(transport, source, user);
			
			//Get topics
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
		}
	}
	;
}