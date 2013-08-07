// admin panel
var config = require('../ctrlers/config');

exports.page = function(req, res) {
    res.render('admin/index');
};

exports.update = function(req, res) {
    var setting = req.body.setting;
    if (setting) {
        config.update(setting._id, setting, function(stat) {
            res.json(stat);
        });
    } else {
        res.json({
            stat: 'fail'
        })
    }
};