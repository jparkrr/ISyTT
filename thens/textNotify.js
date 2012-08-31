var request = require('request');
var querystring = require('querystring');

module.exports = function(message, to) {
  var twilio = {sid: TWILIO_SID, token: TWILIO_TOKEN, hostname: TWILIO_HOSTNAME, hostnumber: TWILIO_HOSTNUMBER};
  if (!message) message = 'You have a text notification without a message!';
  var TwilioClient = require('twilio').Client;
  var client = new TwilioClient(twilio.sid, twilio.token, twilio.hostname);
  var phone = client.getPhoneNumber(hostnumber);
  phone.setup(function() {
    phone.sendSms(to, message, null, function(sms) {console.log(sms); console.log('sent?');});
  });
};
