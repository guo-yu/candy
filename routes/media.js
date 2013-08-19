// media
exports.upload = function(req, res, next) {
    console.log(req.files.media);
    if (req.files.media) {
        var file = req.files.media.path;
        res.json({
            stat: 'ok',
            file: req.files.media,
            url: file.substr(file.lastIndexOf('/uploads'))
        });
    } else {
        next(new Error('404'));
    }
}

exports.download = function(req, res, next) {

}