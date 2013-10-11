var model = require('../models/index'),
    media = model.media;

// list medias
exports.ls = function(cb) {
    media.find({}).exec(function(err, ms) {
        cb(err, ms);
    });
}

// count media
exports.count = function(cb) {
    media.count({}, function(err, count) {
        cb(err, count);
    });
}

exports.read = function(id, cb) {
    media.findById(id).populate('threads').populate('user').exec(function(err, media) {
        cb(err, media);
    });
}

// queryById
exports.queryById = function(id, cb) {
    media.findById(id).exec(function(err, m) {
        cb(err, m);
    });
}

exports.create = function(baby, cb) {
    var baby = new media(baby);
    baby.save(function(err) {
        cb(err, baby);
    })
}

exports.remove = function(id) {
    media.findByIdAndRemove(id, function(err) {
        cb(err, id);
    })
}

exports.countDownload = function(file,cb) {
    file.count.download = file.count.download + 1;
    file.save(function(err){
        cb(err, file);
    })
}