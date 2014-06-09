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
      fetchData(function(err, info) {
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

  function fetchData(done) {
    async.parallel({
      config: function(callback) {
        config.read(callback);
      },
      users: function(callback) {
        user.list(callback);
      },
      boards: function(callback) {
        board.list('all', callback);
      },
      threads: function(callback) {
        thread.list(callback);
      },
      themes: function(callback) {
        theme.list(callback);
      },
      newbies: function(callback) {
        async.parallel({
          user: function(cb){
            user.newbies('created', 'day', cb);
          },
          board: function(cb){
            board.newbies('created', 'day', cb);
          },
          thread: function(cb) {
            thread.newbies('pubdate', 'day', cb);
          }
        }, callback);
      }
    }, done);
  }

  function checkAdmin(req, res, next) {
    if (!res.locals.user) return res.redirect('/');
    if (res.locals.user.type != 'admin') return res.redirect('/');
    return next();
  }

}