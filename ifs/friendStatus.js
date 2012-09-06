module.exports = function(data, friends) {
  
  if (!data || !data[0] || !data[0].type != 'status') return false;

  var status = data[0];

  async.filter(data, function(status, cb) {
    //facebook
    if (friends.indexOf(status.data.from.name) != -1) return cb(true);
    //twitter
    if (friends.indexOf(status.data.user.screen_name) != -1) return cb(true);
  }, function(results) {
    if (results.length == 0) return false;
    else return true;
  });
}
