module.exports = configCtrler;

function configCtrler(models, Ctrler) {
  var Config = new Ctrler(models.config);
  var config = models.config;
  Config.read = function(callback) {
    config.findOne({}).exec(callback);
  };
  return Config;
}
