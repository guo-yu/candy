// sign
var Duoshuo = require('duoshuo'),
    user = require('../ctrlers/user');

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
    }, function(baby) {
        cb(baby);
    })
}

var queryUser = function(id, cb) {
    user.readByDsId(id, function(user) {
        cb(user);
    })
}

// signin
exports.in = function(req, res) {
    var code = req.query.code,
        duoshuo = new Duoshuo(res.locals.App.app.locals.site.duoshuo);
    duoshuo.auth(code, function(result) {
        if (result != 'error') {
            queryUser(result.user_id, function(u) {
                if (u) {
                    // user exist
                    req.session.user = u;
                    res.redirect('back');
                } else {
                    // first signin
                    user.count(function(count){
                        if (count == 0) {
                            result['type'] = 'admin';
                        };
                        createUser(result, function(baby) {
                            req.session.user = baby;
                            if (count == 0) {
                                res.redirect('/admin/');
                            } else {
                                res.redirect('/member/' + req.session.user._id);
                            }
                        });
                    });
                }
            })
        } else {
            res.json(result);
        }
    })
};

// signout
exports.out = function(req, res) {
    if (req.session.user) {
        delete req.session.user;
        res.redirect('back');
    }
};

// check
exports.check = function(req, res, next) {
    passport(req, res, next, function() {
        // Not-authed
        res.render('sign');
    });
}

// check cb(json)
exports.checkJSON = function(req, res, next) {
    passport(req, res, next, function() {
        res.json({
            stat: 'fail',
            msg: 'login required'
        });
    });
}

// set passport
exports.passport = function(req, res, next) {
    passport(req, res, next, function() {
        next();
    });
}

// check admin user
exports.checkAdmin = function(req, res, next) {
    if (res.locals.user && res.locals.user.type == 'admin') {
        next();
    } else {
        res.redirect('/');
    }
}