var request = require('request');
var sprintf = require('sprintf').sprintf;
var OAuth2 = require('oauth').OAuth2;
var querystring = require('querystring');
var express = require('express');

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
    function getProtectedResource(path, session, callback) {
      oa.getProtectedResource(apiBaseUrl + path, session.access_token, callback);
    }

    // Given the name of a service and the array of profiles, return a link to that
    // service that's styled appropriately (i.e. show a link or a checkmark).
    function getLink(prettyName, profiles, token) {
      var service = prettyName.toLowerCase();

      // If the user has a profile authorized for this service
      if (profiles && profiles[service] !== undefined) {
        // Return a unicode checkmark so that the user doesn't try to authorize it again
        var ret = sprintf('<span class="check">&#10003;</span> <a href="%s/services/%s?access_token=%s">%s</a> <a href="#" class="del" data-serv="%s" data-id="%s">X</a>', apiBaseUrl, service, token, prettyName, service, profiles[service][0]);
        return ret;
      }

      // This flow is documented here: http://dev.singly.com/authorization
      var queryString = querystring.stringify({
        client_id: clientId,
          redirect_uri: sprintf('%s/callback', hostBaseUrl + ':' + hostPort),
          service: service
      });

      return sprintf('<a href="%s/oauth/authorize?%s">%s</a>',
          apiBaseUrl,
          queryString,
          prettyName);
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
      var i;
      var services = [];

      // For each service in usedServices, get a link to authorize it
      for (i = 0; i < usedServices.length; i++) {
        services.push({
          name: usedServices[i],
          link: getLink(usedServices[i], req.session.profiles, req.session.access_token)
        });
      }

      // Render out views/index.ejs, passing in the array of links and the session
      res.render('index', {
        services: services,
        session: req.session
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

        // Fetch the user's service profile data
        getProtectedResource('/profiles', req.session, function(err, profilesBody) {
          try {
            profilesBody = JSON.parse(profilesBody);
          } catch(parseErr) {
            return res.send(parseErr, 500);
          }

          req.session.profiles = profilesBody;

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