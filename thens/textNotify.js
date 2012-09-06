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
  var client = new TwilioClient(TWILIO_SID, TWILIO_TOKEN, TWILIO_HOSTNAME);
  var phone = client.getPhoneNumber(TWILIO_HOSTNUMBER);
  phone.setup(function() {
    phone.sendSms(to, message, null, function(sms) {console.log(sms);});
  });
};
