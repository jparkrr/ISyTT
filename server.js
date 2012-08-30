var express = require('express');

var hostBaseUrl = process.env.HOST || 'http://lvh.me';
var hostPort = process.env.PORT || 3000;

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var THEN = require('./thens');
var IF = require('./ifs');

// Authentication endpoint and push configuration endpoint
var server = express();
require('./auth')(server, clientId, clientSecret, hostBaseUrl, hostPort);

// POSTman to catch scripts and run posts
server.post('/event', function(req, res) { 
  var body = req.body;
  var token = require('fs').readFileSync('./config/access_token.txt', 'utf8');
  if (IF.friendStatus(body, ['Justin Parker', 'Charlie Johnson'])) THEN.textNotify('Your friend has a status update', '+14152053607');
  if (IF.fitbitLow(body)) THEN.textNotify('Your fitbit has low battery', '+1xxxxxxxxxx');
  if (IF.atWork(body)) THEN.share(['twitter'], 'Another day at work!', token);
});
