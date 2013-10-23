var Ctrler = require('./index'),
    model = require('../models/index'),
    media = model.media;

var Media = new Ctrler(media);

Media.read = function(id, callback) {
    media.findById(id).populate('threads').populate('user').exec(callback);
}

// 需要使用inc修改
Media.countDownload = function(file, callback) {
    file.count.download = file.count.download + 1;
    file.save(function(err){
        callback(err, file);
    });
}

module.exports = Media;