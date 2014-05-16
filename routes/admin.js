var async = require('async');

module.exports = function(deps) {
  
  var ctrlers = deps.ctrlers;
  var express = deps.express;
  var theme = deps.theme;

  var Admin = express.Router();
  var config = ctrlers.config;
  var user = ctrlers.user;
  var board = ctrlers.board;
  var thread = ctrlers.thread;

  // => /admin
  Admin.route('/')
    // PAGE: Home of Admin panel
    .get(checkAdmin, function(req, res, next) {
      read(function(err, info) {
        if (err) return next(err);
        theme.render('flat/admin/index', info, function(err, html) {
          if (err) return next(err);
          res.send(html);
        });
      });
    })
    // API: update Settings
    .post(checkAdmin, function(req, res, next) {
      if (!req.body.setting) return next(new Error('缺少表单'));
      var id = req.body.setting._id;
      var settings = req.body.setting;
      if (settings._id) delete settings._id;
      config.update(id, settings, function(err, site) {
        if (err) return next(err);
        deps.locals.site = site;
        return res.json(site);
      });
    });

  return Admin;

  function read(callback) {
    async.parallel({
      config: function(cb) {
        config.read(cb);
      },
      users: function(cb) {
        user.list(cb);
      },
      boards: function(cb) {
        board.ls(cb);
      },
      threads: function(cb) {
        thread.list(cb);
      },
      themes: function(cb) {
        theme.list(cb);
      }
    }, callback);
  }

  function checkAdmin(req, res, next) {
    if (!res.locals.user) return res.redirect('/');
    if (res.locals.user.type != 'admin') return res.redirect('/');
    return next();
  }

}