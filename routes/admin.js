// admin panel
var admin = require('../ctrlers/admin');

// PAGE: 管理后台首页
exports.page = function(req, res, next) {
    admin.read(function(err, info) {
        if (!err) {
            res.render('admin/index', info);
        } else {
            next(err)
        }
    })
};

// API: 更新网站设置
exports.update = function(req, res, next) {
    if (req.body.setting) {
        admin.update(req.body.setting, function(err, site) {
            if (!err) {
                res.locals.App.app.locals.site = site;
                res.json(site)
            } else {
                next(err)
            }
        });
    } else {
        next(new Error('缺少表单'))
    }
};