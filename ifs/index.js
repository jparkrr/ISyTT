require('fs').readdirSync('./thens').forEach(function (file) {
  exports[file.split('.')[0]] = require('./' + file);
});
