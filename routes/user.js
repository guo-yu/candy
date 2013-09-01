var user = require('../ctrlers/user');

// PAGE: read
exports.read = function(req, res, next) {
    user.read(req.params.id, function(err, b) {
        if (!err) {
            res.render('user', b)
        } else {
            next(err)
        }
    });
}

// PAGE: mime
exports.mime = function(req, res, next) {
    // 这里没有做分页
    if (req.params.id) {
        user.read(req.params.id, function(err, u) {
            if (!err) {
                if (u) {
                    res.render('mime', {
                        uu: u
                    })
                } else {
                    next(new Error('404'));
                }
            } else {
                next(err)
            }
        })
    } else {
        next(new Error('404'))
    }
}

// API: update
exports.update = function(req, res, next) {
    user.update(req.params.id, req.body.user, function(err, user) {
        if (!err) {
            res.json({
                stat: 'ok',
                user: user.body
            })
        } else {
            next(err)
        }
    });
}

// API: create
exports.create = function(req, res, next) {
    user.create(req.body.user, function(err, baby) {
        if (!err) {
            res.json({
                stat: 'ok',
                user: baby
            })
        } else {
            next(err);
        }
    })
}

// API: remove
exports.remove = function(req, res, next) {
    user.remove(req.params.id, function(err, uid) {
        if (!err) {
            res.json({
                stat: 'ok',
                user: user.body
            })
        } else {
            next(err);
        }
    })
}

// API: Sync to duoshuo
exports.sync = function(req, res ,next) {
    var uu = req.body.user;
    if (uu && typeof(uu) == 'object') {
        user.queryById(req.session.user._id, function(err, u) {
            if (!err) {
                u.nickname = uu.name;
                u.url = uu.url;
                u.avatar = uu.avatar;
                u.save(function(err) {
                    if (!err) {
                        // 同步本地用户到多说
                        user.sync(res.locals.App.app.locals.site.duoshuo,u,function(err,result){
                            if (!err) {
                                var result = result.body;
                                if (result.code == 0) {
                                    req.session.user = u;
                                    res.json({
                                        stat: 'ok',
                                        user: u
                                    });
                                } else {
                                    next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.errorMessage))
                                }
                            } else {
                                next(err);
                            }
                        });
                    } else {
                        next(err)
                    }
                });
            } else {
                next(err)
            }
        });
    }
}