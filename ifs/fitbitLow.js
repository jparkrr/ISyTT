/* This checks to see if a fit bit's battery is low.
   Questionable whether singly will push this, as it is 
   updated data rather than new data. */

module.exports = function(data) {
  if (!data || !data[0] || !data[0].data || !data[0].data.battery) return false;
  if (data[0].data.battery == 'Low') return true;
  else false;
}
