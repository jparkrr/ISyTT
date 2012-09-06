var work = require('../config/config.json').work;

module.exports = function(data) {
console.log('hello!');
console.log(work);
console.log(data[0].oembed);
  if (!data || !data[0] || !data[0].type || data[0].type != 'checkin') return false;
  return checkinIsNear(data[0].oembed, work, work.err); 
};


checkinIsNear = function(checkin, place, radius) {
  var ret = true;
  if (checkin.lat < place.lat - radius || checkin.lat > place.lat + radius) ret = false;
  if (checkin.lng < place.lng - radius || checkin.lng > place.lng + radius) ret = false;
  return ret;
};
