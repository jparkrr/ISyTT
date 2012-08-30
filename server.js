var express = require('express');

var hostBaseUrl = 'http://lvh.me';
var hostPort = process.env.PORT || 3000;

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var THEN = require('./thens');
var IF = require('./ifs');

// Authentication endpoint and push configuration endpoint
var server = express();
require('./auth')(server, clientId, clientSecret, hostBaseUrl, hostPort);

// POSTman to catch scripts and run posts

server.get('/share', function(req, res) {
  THEN.share('testnow', token, ['facebook']);
});

server.post('/event', function(req, res) { 
  var body = req.body;
  if (IF.friendStatus(body, ['Justin Parker', 'Charlie Johnson'])) THEN.textNotify('Your friend has a status update', '+14152053607');
});
