// admin panel
var admin = require('../ctrlers/admin');

exports.page = function(req, res) {
    admin.read(function(info){
        res.render('admin/index',info);
    })
};

exports.update = function(req, res) {
    if (req.body.setting) {
        admin.update(req.body.setting,function(site){
            res.locals.App.app.locals.site = site;
            res.json(site)
        });
    } else {
        res.json({
            stat: 'fail'
        })
    }
};