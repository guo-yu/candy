exports = module.exports = function($models, $Ctrler) {

    var Config = new $Ctrler($models.config),
        config = $models.config;

    Config.read = function(callback) {
        config.findOne({}).exec(callback);
    }

    Config.check = function(callback) {
        this.count(function(err, counts) {
            callback(err, (counts !== 0))
        });
    }

    return Config;

}