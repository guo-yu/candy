// sign
var duoshuo = require('duoshuo'),
    user = require('../ctrlers/user');

var createUser = function(result,cb) {
    user.create({
        duoshuo: {
            user_id: result.user_id,
            access_token: result.access_token
        }
    }, function(baby) {
        cb(baby);
    })
}

var queryUser = function(id,cb) {
    user.readByDsId(id,function(user){
        cb(user);
    })
}

// signin
exports.in = function(req, res) {
    var code = req.query.code;
    duoshuo.auth(code, function(result) {
        if (result != 'error') {
            queryUser(result.user_id,function(u){
                if (u) {
                    req.session.user = u;
                    res.redirect('/');
                } else {
                    createUser(result,function(baby){
                        req.session.user = baby;
                        res.redirect('/');
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
exports.check = function(req,res,next) {
    if (req.session.user) {
        next()
    } else {
        res.redirect('/');
    }
}

// check admin user
exports.checkAdmin = function(req,res,next) {
    if (req.session.user && req.session.user.type == 'admin') {
        next()
    } else {
        res.redirect('/');
    }
}