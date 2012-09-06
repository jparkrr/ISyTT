var request = require('request');
var querystring = require('querystring');

var TWILIO_SID = process.env.TWILIO_SID;
var TWILIO_HOSTNAME = process.env.TWILIO_TOKEN;
var TWILIO_HOSTNUMBER = process.env.TWILIO_HOSTNUMBER;
var TWILIO_TOKEN = process.env.TWILIO_TOKEN;

module.exports = function(message, to) {
  var twilio = {sid: TWILIO_SID, token: TWILIO_TOKEN,
                hostname: TWILIO_HOSTNAME, hostnumber: TWILIO_HOSTNUMBER};
  if (!message) message = 'You have a text notification without a message!';
  var TwilioClient = require('twilio').Client;
  var client = new TwilioClient(twilio.sid, twilio.token, twilio.hostname);
  var phone = client.getPhoneNumber(twilio.HOSTNUMBER);
  phone.setup(function() {
    phone.sendSms(to, message, null, function(sms) {console.log(sms);});
  });
};
