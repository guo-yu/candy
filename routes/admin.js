var async = require('async'),
    Theme = require('theme');

var themes = new Theme;

exports = module.exports = function(ctrlers, locals, theme) {

    var config = ctrlers.config,
        user = ctrlers.user,
        board = ctrlers.board;

    var read = function(callback) {
        async.parallel({
            config: function(cb){
                config.read(cb);
            },
            users: function(cb){
                user.list(cb);
            },
            boards: function(cb) {
                board.ls(cb);
            },
            themes: function(cb) {
                themes.list(cb);
            }
        }, callback);
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
            var id = req.body.setting._id;
            var settings = req.body.setting;
            if (settings._id) delete settings._id;
            config.update(id, settings, function(err, site) {
                if (err) return next(err);
                locals.site = site;
                return res.json(site);
            });
        }
    }
}
