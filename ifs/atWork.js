var work = require('../config/config.json').work;
var lib = require('./lib.js');

module.exports = function(data) {
  if (!data || !data[0] || !data[0].type || data[0].type != 'checkin') return false;
  return lib.checkinIsNear(data[0].oembed, work, work.err); 
};
