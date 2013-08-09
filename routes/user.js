var user = require('../ctrlers/user');

exports.read = function(req, res, next) {
    user.read(req.params.id, function(b) {
        res.render('user', b)
    });
}

exports.update = function(req, res, next) {
    user.update(req.params.id, req.body.user, function(user) {
        res.json({
            stat: user.stat,
            user: user.body
        })
    });
}

exports.create = function(req, res, next) {
    user.create(req.body.user, function(baby) {
        res.json({
            stat: 'ok',
            user: baby
        })
    })
}

exports.remove = function(req, res, next) {
    user.remove(req.params.id, function(user) {
        res.json({
            stat: user.stat,
            user: user.body
        })
    })
}

exports.mime = function(req, res) {
    if (req.params.id) {
        user.queryById(req.params.id,function(u){
            res.render('mime',{
                uu: u
            })
        })
    } else {
        res.render('404');
    }
}

// 同步用户信息
exports.sync = function(req, res) {
    var uu = req.body.user;
    if (uu && typeof(uu) == 'object') {
        user.queryById(req.session.user._id,function(u){
            u.nickname = uu.name;
            u.url = uu.url;
            u.avatar = uu.avatar;
            u.save(function(err){
                if (!err) {
                    req.session.user = u;
                    res.json({
                        stat: 'ok',
                        user: u
                    })
                } else {
                    res.json({
                        stat: 'error',
                        error: err
                    })
                }
            });
        });
    }
}