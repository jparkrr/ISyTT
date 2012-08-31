module.exports.checkinIsNear = function(checkin, place, radius) {
  var ret = true;
  if (checkin.lat < work.lat - radius || checkin.lat > work.lat + radius) ret = false;
  if (checkin.lng < work.lng - radius || checkin.lng > work.lng + radius) ret = false;
  return ret;
};
