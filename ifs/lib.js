module.exports.checkinIsNear = function(checkin, place, radius) {
  var ret = true;
  if (checkin.lat < place.lat - radius || checkin.lat > place.lat + radius) ret = false;
  if (checkin.lng < place.lng - radius || checkin.lng > place.lng + radius) ret = false;
  return ret;
};
