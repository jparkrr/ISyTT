var request = require('request');
var sprintf = require('sprintf').sprintf;
var OAuth2 = require('oauth').OAuth2;
var querystring = require('querystring');
var express = require('express');
var async = require('async');
var fs = require('fs');

function clearPushes(req, base, callback) {
  request.post({
    uri: sprintf('%s/push/upsert?access_token='+req.session.access_token, base),
    body: '{}',
    headers: {
      'Content-Type': 'application/json'
    }
  }, callback);
};

module.exports = function(app, clientId, clientSecret, hostBaseUrl, hostPort) {
    var apiBaseUrl = 'https://api.singly.com';
    var sessionSecret = '42';

    var usedServices = [
      'Facebook',
      'foursquare',
      'Instagram',
      'Tumblr',
      'Twitter',
      'LinkedIn',
      'FitBit',
      'Email',
      'Withings',
      'Zeo'
    ];

    var oa = new OAuth2(clientId, clientSecret, apiBaseUrl);

    // A convenience method that takes care of adding the access token to requests
    function getProtectedResource(path, access_token, callback) {
      oa.getProtectedResource(apiBaseUrl + path, access_token, callback);
    }

    // Given the name of a service and the array of profiles, return a link to that
    // service that's styled appropriately (i.e. show a link or a checkmark).
    function getLink(prettyName, profiles, pushes, token, callback) {
      var service = prettyName.toLowerCase();
      // This flow is documented here: http://dev.singly.com/authorization
      var queryString = querystring.stringify({
        client_id: clientId,
        redirect_uri: sprintf('%s/callback', hostBaseUrl),
        service: service
      });
      // If the user has a profile authorized for this service
      if (profiles && profiles[service] !== undefined) {
        var ret = sprintf('<li><span class="check">&#10003;</span> <a href="%s/services/%s?access_token=%s">%s</a>', apiBaseUrl, service, token, prettyName);
        getProtectedResource('/services/' + service, token, function(err, endpoints) {
          try {
            endpoints = JSON.parse(endpoints);
          } catch(parseErr) {
            return callback(ret);
          }
          ret += "<ul>";
          async.forEachSeries(Object.keys(endpoints), function(index, cb) {
            var url = apiBaseUrl + '/services/' + service + '/' + index;
            if (pushes && pushes[url] !== undefined) {
              ret += '<li><span class="check">&#10003;</span>' + index;
            }
            else {
              ret += sprintf('<li><a href="/push?service=%s&endpoint=%s">%s</a>',
                      service,
                      index,
                      index);
            }
            cb();
          }, function (err) {
            ret += '</ul>';
            return callback(ret);
          });
        });
      }
      else {
        return callback(sprintf('<li><a href="%s/oauth/authorize?%s">%s</a>',
            apiBaseUrl,
            queryString,
            prettyName));
      }
    }

    // Setup for the express web framework
    app.configure(function() {
      app.use(express.logger());
      app.use(express.static(__dirname + '/public'));
      app.use(express.bodyParser());
      app.use(express.cookieParser());
      app.use(express.session({
        secret: sessionSecret
      }));
      app.use(app.router);
    });

    // We want exceptions and stracktraces in development
    app.configure('development', function() {
      app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    });

    // ... but not in production
    app.configure('production', function() {
      app.use(express.errorHandler());
    });

    // Use ejs instead of jade because HTML is easy
    app.set('view engine', 'ejs');

    app.get('/', function(req, res) {
      var i, j;
      var services = [];

      // For each service in usedServices, get a link to authorize it
      async.forEach(usedServices, function(service, callback) {
        getLink(service, req.session.profiles, req.session.pushes, req.session.access_token, function (link) {
          services.push({
            name: service,
            link: link
          });
          callback();
        });
      }, function(err) {
        // Render out views/index.ejs, passing in the array of links and the session
        res.render('index', {
          services: services,
          session: req.session
        });
      });
    });

    app.get('/clear', function(req, res) {
      clearPushes(req, apiBaseUrl, function() {
        res.redirect('/');
      });
    });

    app.get('/push', function (req, res) {
      var data = {};
      data[apiBaseUrl + '/services/' + req.query.service + '/' + req.query.endpoint] = hostBaseUrl + 'post';
      request.post({
        uri: sprintf('%s/push/upsert?access_token='+req.session.access_token, apiBaseUrl),
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      }, function (err, resp, body) {
        try {
          console.log(err);
          body = JSON.parse(body);
        } catch(parseErr) {
          return res.send(parseErr, 500);
        }
        console.log(body);
        res.redirect('/');
      });
    });

    app.get('/callback', function(req, res) {
      var data = {
        client_id: clientId,
      client_secret: clientSecret,
      code: req.param('code')
      };

      // Exchange the OAuth2 code for an access_token
      request.post({
        uri: sprintf('%s/oauth/access_token', apiBaseUrl),
        body: querystring.stringify(data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, function (err, resp, body) {
        try {
          body = JSON.parse(body);
        } catch(parseErr) {
          return res.send(parseErr, 500);
        }

        // Save the access_token for future API requests
        req.session.access_token = body.access_token;
        fs.writeFile('./config/access_token.txt', req.session.access_token, 'utf8', function (err) {
          if (err) console.log(err);
        }); 

        // Fetch the user's service profile and push data
        async.parallel([
          function(callback) {
            getProtectedResource('/profiles', req.session.access_token, function(err, profilesBody) {
              try {
                profilesBody = JSON.parse(profilesBody);
              } catch(parseErr) {
                return res.send(parseErr, 500);
              }
              req.session.profiles = profilesBody;
              console.log("getting profiles");
              callback();
            });
          },
          function(callback) {
            getProtectedResource('/push', req.session.access_token, function(err, pushBody) {
 console.log('these are the pushes you are subscribed to');
 console.log(pushBody);
              if (err) {
                req.session.pushes = {};
                return callback();
              }
              try {
                pushBody = JSON.parse(pushBody);
              } catch(parseErr) {
                console.log('push error');
                return res.send(parseErr, 500);
              }
              req.session.pushes = pushBody.data;
              console.log("getting push");
              callback();
            });
        }],
        function() {
          console.log("done");
          res.redirect('/');
        });
      });
    });

    app.post('/post', function(req,res) {
      console.log(req.body);
      res.send('OK');
    });

    app.listen(hostPort);

    console.log(sprintf('Listening at %s using API endpoint %s.', hostBaseUrl, apiBaseUrl));
}
