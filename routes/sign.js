// sign
var duoshuo = require('duoshuo'),
    user = require('../ctrlers/user');

var passport = function(req, res, next, cb) {
    if (req.session.user) {
        res.locals.user = req.session.user
        next()
    } else {
        cb();
    }
}

var checkMaster = function(cb) {
    user.count(function(count) {
        if (count == 1) {
            cb(true)
        } else {
            cb(false);
        }
    })
}

var createUser = function(result, cb) {
    user.create({
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
    var code = req.query.code;
    duoshuo.auth(code, function(result) {
        if (result != 'error') {
            queryUser(result.user_id, function(u) {
                if (u) {
                    req.session.user = u;
                    res.redirect('back');
                } else {
                    createUser(result, function(baby) {
                        req.session.user = baby;
                        res.redirect('/member/' + req.session.user._id);
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
        res.redirect('/');
    }
};

// check
exports.check = function(req, res, next) {
    passport(req, res, next, function() {
        res.redirect('/');
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

// check creater
exports.checkMaster = function(req, res, next) {
    if (req.session.user) {
        checkMaster(function(stat) {
            if (stat) {
                user.query(req.session.user._id, function(u) {
                    if (u && u != 'error') {
                        u.type = 'admin';
                        u.save(function(err) {
                            if (!err) {
                                res.locals.user = u;
                                next();
                            } else {
                                console.log(err);
                            }
                        })
                    }
                })
            } else {
                res.locals.user = req.session.user;
                next();
            }
        })
    } else {
        res.redirect('/');
    }
}

// check admin user
exports.checkAdmin = function(req, res, next) {
    if (req.session.user && (req.session.user.type == 'admin' || res.locals.user && res.locals.user.type == 'admin')) {
        next();
    } else {
        res.redirect('/');
    }
}