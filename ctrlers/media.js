exports = module.exports = function($models, $Ctrler) {

    var Media = new $Ctrler($models.media),
        media = $models.media;

    Media.read = function(id, callback) {
        media.findById(id).populate('threads').populate('user').exec(callback);
    };

    // 需要使用inc修改
    Media.countDownload = function(file, callback) {
        file.count.download = file.count.download + 1;
        file.save(function(err) {
            callback(err, file);
        });
    };

    return Media;

}