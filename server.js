var express = require('express');
var request = require('request');

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
server.post('/post', function(req, res) { 
  var body = req.body;
  console.log(body);
  var token = require('fs').readFileSync('./config/access_token.txt', 'utf8');
  if (IF.atWork(body)) THEN.textNotify('You checked in at work', '+14152053607');
/*
  if (IF.friendStatus(body, ['Justin Parker', 'Charlie Johnson']))
    THEN.textNotify('Your friend has a status update', '+14152053607');

  var email = {to: "charlie@singly.com", subject: "push works!", message: "test body"}; 
  if (IF.friendStatus(body, ['Justin Parker', 'Charlie Johnson'])) THEN.emailNotify(email);

  if (IF.iTweet(body)) THEN.textNotify('You just tweeted', '+14152053607'); 

  if (IF.fitbitLow(body)) THEN.textNotify('Fitbit low battery', '+14152053607');
  */

  //Try for syntax like: IF(fitbitLow, body, THEN.textNotify, bam, bam);
});
