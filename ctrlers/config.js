var Ctrler = require('./index'),
    model = require('../models/index'),
    config = model.config;

var Config = new Ctrler(config);

exports.read = function(callback) {
    config.findOne({}).exec(callback);
}

exports.check = function(callback) {
    this.count(function(err, counts){
        callback(err, (counts !== 0))
    });
}

module.exports = Config;