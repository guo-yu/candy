// media
var media = require('../ctrlers/media');

exports.upload = function(req, res, next) {
    if (req.files.media) {
        // 能否将这个path更友好的组织起来？
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
                        media.countDownload(file,function(err,f){
                            if (!err) {
                                res.download(file.src,file.name);
                            } else {
                                next(err);
                            }
                        })
                    } else {
                        // 这里要扩充判断逻辑
                        // 比如需要注册分享，需要分享分享等等
                        if (res.locals.user) {
                            media.countDownload(file,function(err,f){
                                if (!err) {
                                    res.download(file.src);
                                } else {
                                    next(err);
                                }
                            })
                        } else {
                            next(new Error('403'))
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
exports.sync = function(req, res, next) {
    
}