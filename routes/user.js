exports = module.exports = function($ctrlers) {

    var user = $ctrlers.user;

    return {
        // PAGE: read
        show: function(req, res, next) {
            user.read(req.params.id, function(err, b) {
                if (err) return next(err);
                res.render('user', b);
            });
        },
        // PAGE: mime
        mime: function(req, res, next) {
            if (!req.params.id) return next(new Error('404'));
            // 这里没有做分页
            user.read(req.params.id, function(err, u) {
                if (err) return next(err);
                if (!u) return next(new Error('404'));
                res.render('mime', {
                    uu: u
                });
            });
        },
        // API: update
        update: function(req, res, next) {
            user.update(req.params.id, req.body.user, function(err, user) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    user: user.body
                });
            });
        },
        // API: create
        create: function(req, res, next) {
            user.create(req.body.user, function(err, baby) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    user: baby
                });
            })
        },
        // API: remove
        destroy: function(req, res, next) {
            user.remove(req.params.id, function(err, uid) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    user: user.body
                });
            })
        },
        // API: Sync to duoshuo
        sync: function(req, res, next) {
            var uu = req.body.user;
            if (!(uu && typeof(uu) == 'object')) return next(new Error('user required'));
            user.findById(req.session.user._id, function(err, u) {
                if (err) return next(err);
                u.nickname = uu.name;
                u.url = uu.url;
                u.avatar = uu.avatar;
                u.save(function(err) {
                    if (err) return next(err);
                    // 同步本地用户到多说
                    user.sync(res.locals.app.locals.site.duoshuo, u, function(err, result) {
                        if (err) return next(err);
                        var result = result.body;
                        if (result.code !== 0) return next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.errorMessage));
                        req.session.user = u;
                        res.json({
                            stat: 'ok',
                            user: u
                        });
                    });
                });
            });
        }
    }

}