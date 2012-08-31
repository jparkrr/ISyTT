require('fs').readdirSync('./thens').forEach(function (file) {
  var ignore = ['index.js', 'lib.js'];
  if(file[0] != '.' && ignore.indexOf(file) == -1) exports[file.split('.')[0]] = require('./' + file);
});
