module.exports = function(data, friends) {
  
  if (!data || !data[0] || !data[0].type != 'status') return false;
  var status = data[0];
  
  //facebook
  if (friends.indexOf(status.data.from.name) != -1) return true;

  //twitter
  if (friends.indexOf(status.data.user.screen_name) return true;

  return false;
}
