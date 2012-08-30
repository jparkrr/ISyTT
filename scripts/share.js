var async = require('async');
var SINGLY = 'https://api.singly.com/';
var request = require('request');

exports.run = function(update, token, services) {
  var url =  SINGLY + 'types/:type?access_token=' + token + '&services=' + services.join(',');
  request.post({url: url, body: update});
}
var token = 'bRMdRFwevENIh524ZT_VxqOizh4=eRlG7G0j56e1e52ffa7efe56edb309cf28a269cc8e13546026b71738c9cd3ef3e76c11e4bbbc7d7d0b194ec5f3fbefd3a1013b01d9dc4dc0dba47f5eeeb6b6d0b99893da939abe49fd51841c6b1a7f43f52756aecb68588dae9a6799227b8ed8240e93ef';

run("tester", token, ['facebook', 'linkedin', 'yammer']); 
