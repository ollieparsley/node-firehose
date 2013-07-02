module.exports = {
	Authentication: require("./lib/authentication/base").Authentication,
	Store:          require("./lib/store/base").Store,
	Transport:      require("./lib/authentication/base").Transport,
	User:           require("./lib/user/base").User,
	createServer:   createServer
}

function createServer(config) {
	return null;
}