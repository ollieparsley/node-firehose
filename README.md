node-firehose
=============

Create an HTTP and WebSocket JSON firefose from anything!

# Background

Creating a firehose for your data can be a daunting propect. You can create one fairly simply, but there are alot of other factors to take into accont.

* What happens if a user is on a slow connection? Memory usage will shoot up as the socket is buffered
* Different autentication methods
* Making it stable. You don't want to kick off happy customers, just because one customer has an error/exception
* Support HTTP and WebSocket connections in parallel

These services, by their very nature, are long lived processes. Any errors will affect all customers connected. I ([OllieParsley](http://ollieparsley.com/)) have experience handling the Twitter firehose and also developing the [DataSift](http://datasift.com/) HTTP Streaming API, which behaves in a similar way to the Twitter Streaming API

# Out the box

If you simply run the firehose server you will have the following:

* No authentication or no authentication
* File based authentication
* No actual data until you have hooked up a connector
* The only data sent will be "ticks" these are JSON objects sent to ensure the connection stays open
* Enough to handle <ulimit> numbers of concurrent connections
