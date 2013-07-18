node-firehose
=============

Create a firefose from anything!

## Background

Creating a firehose for your data can be a daunting propect. You can create one fairly simply, but there are alot of other factors to take into accont.

* What happens if a user is on a slow connection? Memory usage will shoot up as the socket is buffered
* Different authentication methods
* Making it stable. You don't want to kick off happy customers, just because one customer has an error/exception
* Support different transports, user storage, authentication, routes and sources

These services, by their very nature, are long lived processes. Any errors will affect all customers connected. I ([OllieParsley](http://ollieparsley.com/)) have experience handling the Twitter firehose and also developing the [DataSift](http://datasift.com/) HTTP Streaming API, which behaves in a similar way to the Twitter Streaming API

## Installation

### NPM

```bash
npm install tail
```

### Source

```bash
git clone git@github.com:ollieparsley/node-firehose.git
```

## Components

The firehose server is made up of a few big components. These can mostly be combined in anyway to customise the ways a user connects and authenticates with the server.

### Transport

Transports are the different communication methods you have with the user. In the examples directory you will find a ready made HTTP Transport component

Included in this module are:

 * HTTP
 * WebSockets

### Authentication

It is really easy to customise how users are authenticated. This takes care of extracting credentials from a request. The default authentication doesn't check any credentials. In the examples directory you will find a Basic Authentication component.

#### Included transports

 * No authentication
 * Basic Authentication

### Store

Once the firehose server has grabbed credentials (if any) they are passed along to a store and expects a User object in response. The default Store returns a randomly generated user. In the examples directory you can find a JSON Store which has all users stored in a JSON file.

#### Included stores

 * JSON file storage

### Router

Routers are used to make sure the path specified in a request is correct. The default router allows all requests through.

#### Included routers

 * Allow all paths
 * There is an example custom router (in the style of Twitter Streaming API) in the examples

### Source

Arguably the most important component. This is the element that receives your own data and passes it to users. The fake source sends a bit of JSON every 2 seconds.

#### Included sources:

 * Fake (outputs fake JSON date every 2 seconds)
 * MQTT (listen to topics on an MQTT broker)
 * ZeroMQ (SUB or PULL data from ZMQ sockets)
 * File (tail any file)

## Creating your own components

You can create your components by extending our base classes. Check out the examples directory for how to do this. Essentially you include our base class for a component and extend any of the methods using prototype inheritance.
