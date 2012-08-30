var SINGLY = 'https://api.singly.com/';
var request = require('request');

module.exports = function(services, update, token) {
  var url =  SINGLY + 'types/statuses?access_token=' + token + '&services=' + services.join(',');
  url += '&body=' + update;
  request.post(url, function(err, resp){
    if (err) console.log(err);
  });
}
