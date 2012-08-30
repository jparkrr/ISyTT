module.exports = function(data) {
  if (!data || !data[0] || !data[0].data || !data[0].data.battery) return false;
  if (data[0].data.battery == 'Low') return true;
  else false;
}
