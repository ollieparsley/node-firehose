node-firehose
=============

Create an HTTP or WebSocket JSON firefose from anything!

# Background

Creating a firehose for your data can be a daunting propect. You can create one fairly simply, but there are alot of other factors to take into accont.

* What happens if a user is on a slow connection? Memory usage will shoot up as the socket is buffered
* Different autentication methods
* Making it stable. You don't want to kick off happy customers, just because one customer has an error/exception
* Support different transports such as HTTP or WebSockets

These services, by their very nature, are long lived processes. Any errors will affect all customers connected. I ([OllieParsley](http://ollieparsley.com/)) have experience handling the Twitter firehose and also developing the [DataSift](http://datasift.com/) HTTP Streaming API, which behaves in a similar way to the Twitter Streaming API

# Components

The firehose server is made up of a few big components. These can mostly be combined in anyway to customise the ways a user connects and authenticates with the server.

## Transports

Transports are the different communication methods you have with the user. Out-of-the-box we have support for:

* HTTP
* WebSockets

## Authentication

With these two transport methods they use similar request/response flows. Because of this they can both use the 2 built in authentication methods

* None (literally no authentication checks done at all)
* Basic (username:password combinations sent in the Authorization header)

## Stores

Stores are how we check that a users credentials are valid and return any extra details from the user. To start with we only support one type:

* JSON file

