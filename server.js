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
var token = '1lrhqlmh8DQAofTO7xTZ2m6t194=DXXU2JsO10b2b790855e848b3f630fafe18e1cc13a1138b35e1bc953b514d9608dd76ce73fa62fe5b6e0d5a5e1526ad594e8452cd3c171d29827f114082cea607560ea535bfa04c3ea2c0ec3dd3ac5b973779e447186cbb98d172848814cbf8238dcc1c8193a35d8d51b7dbc4ba83eb9ba3dd530';

server.get('/share', function(req, res) {
  THEN.share('testnow', token, ['facebook']);
});

server.post('/event', function(req, res) { 
  var body = req.body;
  var token;
  if (IF.atWork(body)) THEN.share(['twitter'], "I'm at work!", token);
});
