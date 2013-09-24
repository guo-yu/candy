var model = require('../model'),
    config = model.config;

var wash = function(baby) {
    var baby = baby;
    if (baby.hasOwnProperty('_id')) {
        delete baby._id;
    }
    if (baby.hasOwnProperty('__v')) {
        delete baby.__v;
    }
    return baby
}

// 写入配置
exports.create = function(baby,cb){
    var baby = new config(baby);
    baby.save(function(err){
        cb(err, baby);
    })
}

// update 
exports.update = function(id,baby,cb) {
    var baby = wash(baby);
    config.findByIdAndUpdate(id,baby,function(err,result){
        cb(err, result);
    })
}

// 读取配置
exports.readById = function(cb) {
    config.findById(id).exec(function(err,body){
        cb(err, body);
    });
}

// 读取配置
exports.read = function(cb) {
    config.findOne({}).exec(function(err,body){
        cb(err, body);
    });
}

// 检查是否已经写入
exports.check = function(cb) {
    config.count().exec(function(err,conuts){
        cb(err, conuts);
    })
}