// sign
var Duoshuo = require('duoshuo'),
    user = require('../ctrlers/user'),
    async = require('async');

var passport = function(req, res, next, cb) {
    if (req.session.user) {
        res.locals.user = req.session.user;
        next()
    } else {
        cb();
    }
}

var createUser = function(result, cb) {
    user.create({
        type: result.type ? result.type : 'normal',
        duoshuo: {
            user_id: result.user_id,
            access_token: result.access_token
        }
    }, function(err, baby) {
        cb(err,baby);
    })
}

var queryUser = function(id, cb) {
    user.readByDsId(id, function(err, user) {
        cb(err,user);
    })
}

// PAGE: 登入
exports.in = function(req, res, next) {
    var code = req.query.code,
        duoshuo = new Duoshuo(res.locals.App.app.locals.site.duoshuo);

    duoshuo.auth(code, function(err, result) {
        // 当通信正常时
        if (!err) {
            var result = result.body;
            // 当返回正确时
            if (result.code == 0) {
                async.waterfall([
                    function(callback) {
                        queryUser(result.user_id, function(err, u) {
                            callback(err, u)
                        });
                    },
                    function(u, callback) {
                        if (u) {
                            req.session.user = u;
                            res.redirect('back');
                        } else {
                            user.count(function(err, count) {
                                callback(err, count);
                            });
                        }
                    },
                    function(count, callback) {
                        if (count == 0) {
                            result['type'] = 'admin';
                        };
                        createUser(result, function(err, baby) {
                            callback(err, count, baby);
                        });
                    }
                ], function(err, count, baby) {
                    if (!err) {
                        req.session.user = baby;
                        if (count == 0) {
                            res.redirect('/admin/');
                        } else {
                            res.redirect('/member/' + req.session.user._id);
                        }
                    } else {
                        next(err);
                    }
                });

            } else {
                // 如果多说挂了
                next(new Error('多说登录出错，请稍后再试或者联系管理员，具体错误:' + result.errorMessage))
            }
        } else {
            next(err);
        }
    })
};

// PAGE: 登出
exports.out = function(req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('back');
    }
};

// MIDDLEWARE: 检查用户是否登录
exports.check = function(req, res, next) {
    passport(req, res, next, function() {
        // Not-authed
        res.render('sign');
    });
}

// MIDDLEWARE: 检查用户是否登录（xhr）
exports.checkJSON = function(req, res, next) {
    passport(req, res, next, function() {
        next(new Error('login required'));
    });
}

// MIDDLEWARE: 为登录用户写入locals
exports.passport = function(req, res, next) {
    passport(req, res, next, function() {
        next();
    });
}

// MIDDLEWARE: 检查用户是否管理员用户
exports.checkAdmin = function(req, res, next) {
    if (res.locals.user && res.locals.user.type == 'admin') {
        next();
    } else {
        res.redirect('/');
    }
}