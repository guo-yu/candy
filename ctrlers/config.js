module.exports = function(models, Ctrler) {

  var Config = new Ctrler(models.config),
    config = models.config;

  Config.read = function(callback) {
    config.findOne({}).exec(callback);
  };

  return Config;

}