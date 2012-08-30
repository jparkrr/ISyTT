var nodemailer = require('nodemailer');
var gmail = require('../config/config.json').gmail;

module.exports = function(email, to) {
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      user: gmail.user,
      pass: gmail.password
    }
  });
  var mailOptions = {
    to: email.to,
    subject: email.subject,
    text: email.messagel
  };
  smtpTransport.sendMail(mailOptions, function(error, response){
  });
  smtpTransport.close();
};

