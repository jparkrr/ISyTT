module.exports.checkinIsNear = function(checkin, place, radius) {
  if (!data || !data[0] || !data[0].type) return false;
  var checkin = data[0].oembed;
  var ret = true;
  if (checkin.lat < work.lat - work.err || checkin.lat > work.lat + work.err) ret = false;
  if (checkin.lng < work.lng - work.err || checkin.lng > work.lng + work.err) ret = false;
  return ret;
};
