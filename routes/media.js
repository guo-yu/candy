// POST    /media              ->  create
// GET     /media/:media       ->  show

exports = module.exports = function($ctrlers) {

    var media = $ctrlers.media;

    return {
        // API: 创建媒体文件
        create: function(req, res, next) {
            if (!res.locals.user) return next(new Error('signin required'));
            if (!req.files.media) return next(new Error('404'));
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
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    file: baby
                });
            });
        },
        // FILE: 下载媒体文件
        // TODO: 这里还要控制一个如果保存在云上的话，要重定向到云，或者从云上拿下来返回
        show: function(req, res, next) {
            if (!req.params.media) return next(new Error('404'));
            media.findById(req.params.media, function(err, file) {
                if (err) return next(err);
                if (!file) return next(new Error('404'));
                if (file.stat == 'public') {
                    media.countDownload(file, function(err, f) {
                        if (err) return next(err);
                        res.download(file.src, file.name);
                    });
                } else {
                    // 这里要扩充判断逻辑
                    // 比如需要注册分享，需要分享分享等等
                    if (!res.locals.user) return next(new Error('403'));
                    media.countDownload(file, function(err, f) {
                        if (err) return next(err);
                        res.download(file.src);
                    });
                }
            })
        }
    }
}