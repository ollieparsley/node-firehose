var mqtt = require('mqtt');
var util = require('util');

mqtt.createServer(function(client) {
  var self = this;

  if (!self.clients) self.clients = {};

  client.on('connect', function(packet) {
    self.clients[packet.clientId] = client;
    client.id = packet.clientId;
    console.log("CONNECT: client id: " + client.id);
    client.subscriptions = [];
    client.connack({returnCode: 0});
  });

  client.on('subscribe', function(packet) {
    var granted = [];

    console.log("SUBSCRIBE(%s): %j", client.id, packet);

    for (var i = 0; i < packet.subscriptions.length; i++) {
      var qos = packet.subscriptions[i].qos
        , topic = packet.subscriptions[i].topic
        , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

      granted.push(qos);
      client.subscriptions.push(reg);
    }

    client.suback({messageId: packet.messageId, granted: granted});
  });

  client.on('publish', function(packet) {
    console.log("PUBLISH(%s): %j", client.id, packet);
    for (var k in self.clients) {
      var c = self.clients[k]
        , publish = false;

      for (var i = 0; i < c.subscriptions.length; i++) {
        var s = c.subscriptions[i];

        if (s.test(packet.topic)) {
          publish = true;
        }
      }

      if (publish) {
        c.publish({topic: packet.topic, payload: packet.payload});
      }
    }
  });

  client.on('pingreq', function(packet) {
    console.log('PINGREQ(%s)', client.id);
    client.pingresp();
  });

  client.on('disconnect', function(packet) {
    client.stream.end();
  });

  client.on('close', function(packet) {
    delete self.clients[client.id];
  });

  client.on('error', function(e) {
    client.stream.end();
    console.log(e);
  });
}).listen(1245, "127.0.0.1");

//Create a client to send data on the firehose topic
var client = mqtt.createClient(1245, "127.0.0.1");
setInterval(function(){
	client.publish("firehose", '{"some_data":' + (new Date().getTime()) + '}');
}, 500);

