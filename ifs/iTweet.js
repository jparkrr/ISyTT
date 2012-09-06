module.exports = function(data) {
  if (!data || !data[0] || !data[0].type != 'status') return false;
  else return true;
}
