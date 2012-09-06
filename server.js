var express = require('express');
var request = require('request');

var hostBaseUrl = process.env.HOST || 'http://lvh.me';
var hostPort = process.env.PORT || 3000;

var clientId = process.env.CLIENT_ID;
var clientSecret = process.env.CLIENT_SECRET;

var THEN = require('./thens');
var IF = require('./ifs').IF;

// Authentication endpoint and push configuration endpoint
var server = express();
require('./auth')(server, clientId, clientSecret, hostBaseUrl, hostPort);

// POSTman to catch scripts and run posts
server.post('/post', function(req, res) { 
  var body = req.body;
  console.log(body);
  var token = require('fs').readFileSync('./config/access_token.txt', 'utf8');
  
  var email = {to: "charlie@singly.com", subject: "push works!", message: "test body"}; 
  IF ('atWork', body, THEN.emailNotify, email);

});
