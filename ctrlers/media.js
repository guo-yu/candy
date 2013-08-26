var model = require('../model'),
    media = model.media;

// list medias
exports.ls = function(cb) {
    media.find({}).exec(function(err, ms) {
        if (!err) {
            cb(null, ms)
        } else {
            cb(err);
        }
    });
}

// count media
exports.count = function(cb) {
    media.count({}, function(err, count) {
        if (!err) {
            cb(null, count)
        } else {
            cb(err);
        }
    });
}

exports.read = function(id, cb) {
    media.findById(id).populate('threads').populate('user').exec(function(err, media) {
        if (!err) {
            cb(null, media)
        } else {
            cb(err)
        }
    });
}

// queryById
exports.queryById = function(id, cb) {
    media.findById(id).exec(function(err, m) {
        if (!err) {
            cb(null, m)
        } else {
            cb(err)
        }
    });
}

exports.create = function(baby, cb) {
    var baby = new media(baby);
    baby.save(function(err) {
        if (!err) {
            cb(null, baby);
        } else {
            cb(err)
        }
    })
}

exports.remove = function(id) {
    media.findByIdAndRemove(id, function(err) {
        if (!err) {
            cb(null, id)
        } else {
            cb(err)
        }
    })
}

exports.countDownload = function(file,cb) {
    file.count.download = file.count.download + 1;
    file.save(function(err){
        if (!err) {
            cb(null,file);
        } else {
            cb(err)
        }
    })
}

exports.router = function(type,cb) {
    if (type == 'public') {
        
    }
}