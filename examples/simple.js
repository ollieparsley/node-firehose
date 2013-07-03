var firehose = require("../index");

console.log(firehose);

//Firehose server options
var options = {
	source: new firehose.Source(),
	transport: {
		config:    {port: 1338, host: "0.0.0.0"},
		class: require("../lib/transport/http")
	}
};

//Create server
var server = firehose.createServer(options, function(client){
	console.log("client", client);
});

//Listen
server.listen();

