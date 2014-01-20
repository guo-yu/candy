// GET     /member/:member       ->  show
// DELETE  /member/:member       ->  destroy

exports = module.exports = function($ctrlers, locals) {

    var user = $ctrlers.user;

    return {
        // PAGE: read
        show: function(req, res, next) {
            if (!req.params.member) return next(new Error('404'));
            user.read(req.params.member, function(err, u) {
                if (err) return next(err);
                if (!u) return next(new Error('404'));
                var isMe = res.locals.user && res.locals.user._id == req.params.member;
                var freshman = isMe && !res.locals.user.nickname
                res.render('member/single', {
                    member: u,
                    isMe: isMe,
                    freshman: freshman
                });
            });
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
                    user.sync(locals.site.duoshuo, u, function(err, result) {
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
        },
        // API: remove
        destroy: function(req, res, next) {
            if (!res.locals.user) return next(new Error('signin required'));
            if (res.locals.user.type !== 'admin') return next(new Error('signin required'));
            user.remove(req.params.member, function(err, uid) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    user: user.body
                });
            });
        }
    }

}