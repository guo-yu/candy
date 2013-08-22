// media
var media = require('../ctrlers/media');

var downloadCount = function(file,cb) {
    file.count.download = file.count.download + 1;
    file.save(function(err){
        if (!err) {
            cb(null,file);
        } else {
            cb(err)
        }
    })
}

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
        media.create(file, function(err, baby) {
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

// 这里还要控制一个如果保存在云上的话，要重定向到云，或者从云上拿下来返回
exports.download = function(req, res, next) {
    if (req.params.id) {
        media.queryById(req.params.id, function(err, file) {
            if (!err) {
                if (file) {
                    if (file.stat == 'public') {
                        downloadCount(file,function(err,f){
                            if (!err) {
                                res.sendfile(file.src);
                            } else {
                                next(err);
                            }
                        })
                    } else {
                        // 这里要扩充判断逻辑
                        if (res.locals.user) {
                            downloadCount(file,function(err,f){
                                if (!err) {
                                    res.sendfile(file.src);
                                } else {
                                    next(err);
                                }
                            })
                        }
                    }
                } else {
                    next(new Error('404'))
                }
            } else {
                next(err)
            }
        })
    }
}

// sync media to cloud service
exports.sync = function() {

}