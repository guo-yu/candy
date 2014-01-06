var async = require('async');

exports = module.exports = function($ctrlers) {

    var config = $ctrlers.config,
        user = $ctrlers.user,
        board = $ctrlers.board;

    var read = function(cb) {
        async.waterfall([
            // read configs
            function(callback) {
                config.read(function(err, c) {
                    callback(err, c);
                })
            },
            // read users
            function(c, callback) {
                user.list(function(err, users) {
                    callback(err, c, users);
                })
            },
            // read boards
            function(c, users, callback) {
                board.ls(function(err, boards) {
                    callback(err, c, users, boards);
                })
            }
        ], function(err, c, users, boards) {
            cb(err, {
                config: c,
                users: users,
                boards: boards
            })
        });
    };

    return {
        // PAGE: 管理后台首页
        page: function(req, res, next) {
            read(function(err, info) {
                if (err) return next(err);
                res.render('admin/index', info);
            })
        },
        // API: 更新网站设置
        update: function(req, res, next) {
            if (!req.body.setting) return next(new Error('缺少表单'));
            var setting = req.body.setting;
            config.update(setting._id, setting, function(err, site) {
                if (err) return next(err);
                res.locals.app.locals.site = site;
                return res.json(site);
            });
        }
    }
}