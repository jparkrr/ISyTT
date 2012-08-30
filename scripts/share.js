var SINGLY = 'https://api.singly.com/';
var request = require('../node_modules/request');

exports.run = function(update, token, services) {
  var url =  SINGLY + 'types/statuses?access_token=' + token + '&services=' + services.join(',');
  url += '&body=' + update;
  request.post(url, function(err, resp){
    console.log(err);
    console.log(resp.body);
  });
}


//Testing
var token = '1lrhqlmh8DQAofTO7xTZ2m6t194=DXXU2JsO10b2b790855e848b3f630fafe18e1cc13a1138b35e1bc953b514d9608dd76ce73fa62fe5b6e0d5a5e1526ad594e8452cd3c171d29827f114082cea607560ea535bfa04c3ea2c0ec3dd3ac5b973779e447186cbb98d172848814cbf8238dcc1c8193a35d8d51b7dbc4ba83eb9ba3dd530';

exports.run("tester", token, ['facebook', 'linkedin', 'yammer']); 
