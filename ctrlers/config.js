var Ctrler = require('./index'),
    model = require('../models/index'),
    config = model.config;

var Config = new Ctrler(config);

Config.read = function(callback) {
    config.findOne({}).exec(callback);
}

Config.check = function(callback) {
    this.count(function(err, counts){
        callback(err, (counts !== 0))
    });
}

module.exports = Config;