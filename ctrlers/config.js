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
        if (!err) {
            cb(baby);
        } else {
            console.log(err);
        }
    })
}

// update 
exports.update = function(id,baby,cb) {
    var baby = wash(baby);
    config.findByIdAndUpdate(id,baby,function(err,result){
        if (!err) {
            cb(result);
        } else {
            console.log(err);
        }
    })
}

// 读取配置
exports.readById = function(cb) {
    config.findById(id).exec(function(err,body){
        if (!err) {
            cb(body);
        } else {
            console.log(err);
        }
    });
}

// 读取配置
exports.read = function(cb) {
    config.findOne({}).exec(function(err,body){
        if (!err) {
            cb(body);
        } else {
            console.log(err);
        }
    });
}

// 检查是否已经写入
exports.check = function(cb) {
    config.count().exec(function(err,conuts){
        if (!err) {
            cb(conuts);
        } else {
            console.log(err);
        }
    })
}