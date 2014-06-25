var debug = require('debug');
var pkg = require('../package');

module.exports = function(msg) {
  return debug(pkg.name)(msg);
}