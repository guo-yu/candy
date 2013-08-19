// media

var media = require('../ctrlers/media');

exports.upload = function(req, res, next) {

    if (req.files.media) {

        var originFile = req.files.media,
            path = originFile.path;

        var file = {
            name: originFile.name,
            type: originFile.type,
            src: path,
            url: path.substr(path.lastIndexOf('/uploads')),
            user: res.locals.user._id,
            meta: {
                size: originFile.size,
                lastModifiedDate: originFile.lastModifiedDate
            }
        };

        media.create(file,function(err,baby){
            if (!err) {
                res.json({
                    stat: 'ok',
                    file: baby
                });
            } else {
                next(err);
            }
        });

    } else {
        next(new Error('404'));
    }
}

exports.download = function(req, res, next) {

}