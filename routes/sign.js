var async = require('async');

exports = module.exports = function(ctrlers, theme) {

    var user = ctrlers.user;

    return {
        // PAGE: 登录页面
        sign: function(req, res, next) {
            if (res.locals.user) return res.redirect('/');
            theme.render('flat/sign', {}, function(err, html) {
                if (err) return next(err);
                return res.send(html);
            });
        },
        // PAGE: 登入
        signin: function(req, res, next) {
            if (!res.locals.duoshuo) return next(new Error('多说登录失败'));
            var result = res.locals.duoshuo;
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
                    user.create({
                        type: result.type ? result.type : 'normal',
                        duoshuo: {
                            user_id: result.user_id,
                            access_token: result.access_token
                        }
                    }, function(err, baby) {
                        callback(err, count, baby);
                    });
                }
            ], function(err, count, baby) {
                if (err) return next(err);
                req.session.user = baby;
                if (count == 0) return res.redirect('/admin/');
                res.redirect('/member/' + req.session.user._id);
            });
        },
        // MIDDLEWARE: 检查用户是否管理员用户
        checkAdmin: function(req, res, next) {
            if (!res.locals.user) return res.redirect('/');
            if (res.locals.user.type != 'admin') return res.redirect('/');
            return next();
        }

    }

}