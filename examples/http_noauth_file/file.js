var fs = require('fs');

//Open file for writing (publicly and in tmp)
var filePath = "/tmp/firehose.log";
fs.open(filePath, 'a', 777, function(error, fd) {
	if (error) {
		console.log("Error opening file " + filePath + " error: " + error.message);
	} else {
		setInterval(function(){
			fs.writeSync(fd, "This is a log entry " + new Date().toString() + "\n");
		}, 500);
	}
});