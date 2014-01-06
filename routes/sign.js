// sign

var Duoshuo = require('duoshuo'),
    async = require('async');

exports = module.exports = function($ctrlers) {

    var user = $ctrlers.user;

    var createUser = function(result, cb) {
        user.create({
            type: result.type ? result.type : 'normal',
            duoshuo: {
                user_id: result.user_id,
                access_token: result.access_token
            }
        }, cb);
    }

    return {
        // PAGE: 登入
        signin: function(req, res, next) {

            if (!req.query.code) return res.render('sign');

            var code = req.query.code,
                duoshuo = new Duoshuo(res.locals.app.locals.site.duoshuo);

            duoshuo.auth(code, function(err, result) {
                if (err) return next(err);
                if (result.body.code !== 0) return next(new Error('多说登录出错，请稍后再试或者联系管理员，具体错误:' + result.body.errorMessage));
                var result = result.body;
                // 当返回正确时
                async.waterfall([
                    function(callback) {
                        user.readByDsId(result.user_id, callback);
                    },
                    function(u, callback) {
                        if (!u) return user.count(callback);
                        req.session.user = u;
                        return res.redirect('back');
                    },
                    function(count, callback) {
                        if (count == 0) result['type'] = 'admin';
                        createUser(result, function(err, baby) {
                            callback(err, count, baby);
                        });
                    }
                ], function(err, count, baby) {
                    if (err) return next(err);
                    req.session.user = baby;
                    if (count == 0) return res.redirect('/admin/');                        
                    res.redirect('/member/' + req.session.user._id);
                });
            })
        },

        // MIDDLEWARE: 检查用户是否管理员用户
        checkAdmin: function(req, res, next) {
            if (!res.locals.user) return res.redirect('/');
            if (res.locals.user.type != 'admin') return res.redirect('/');
            return next();
        }

    }

}