var scripts;

require('fs').readdirSync('./ifs').forEach(function (file) {
  var ignore = ['index.js', 'lib.js'];
  if(file[0] != '.' && ignore.indexOf(file) == -1)
    scripts[file.split('.')[0]] = require('./' + file);
});


exports.IF = function(ifScript, data, thenScript, args) {
  if (scripts[ifScript](data)) thenScript(args);
};
