require('fs').readdirSync('./thens').forEach(function (file) {
  if(file[0] != '.') exports[file.split('.')[0]] = require('./' + file);
});
