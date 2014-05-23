/**
 *
 * Global Dependencies
 *
 **/
var path = require('path');
var Theme = require('theme');
var moment = require('moment');
var installer = require('express-installer');

/**
 *
 * Local Dependencies
 *
 **/
var routers = {};
routers.home = require('./home');
routers.sign = require('./sign');
routers.media = require('./media');
routers.board = require('./board');
routers.thread = require('./thread');
routers.member = require('./member');
routers.admin = require('./admin');

var pkg = require('../package.json');
var home = path.resolve(__dirname, '../');

moment.lang('zh-cn', require('../libs/zh-cn'));

module.exports = function(app, models, ctrlers, middlewares, express) {

  var locals = {};

  // Ensure res.render output correct `sys` locals
  app.locals.sys = pkg;
  // Ensure theme.render output correct `sys` locals
  locals.sys = pkg;
  locals.moment = moment;
  // This URL will be changed in different environment:
  // In Dev env , it will be http://localhost:[port]
  // In Production mode, It will be `app.locals.url`
  locals.url = app.locals.url;

  // Init themeloader
  var theme = new Theme(home, locals, app.locals.site.theme || 'flat');

  // Init routes
  var routes = initRoutes({
    theme: theme,
    express: express,
    ctrlers: ctrlers,
    locals: app.locals, // BUG: 这样多说ID就无法在Web后台进行变更
    middlewares: middlewares
  });

  // Middlewares
  app.use('*', installer(app, models.config, rewriteConfigs));
  app.use('*', middlewares.passport.sign());
  app.use('*', theme.local('user'));

  // home
  app.use('/', routes.home);
  // signin && signout
  app.use('/sign', routes.sign);
  // board
  app.use('/board', routes.board);
  // thread
  app.use('/thread', routes.thread);
  // media
  app.use('/media', routes.media);
  // member
  app.use('/member', routes.member);
  // admin
  app.use('/admin', routes.admin);

  // Every time the app restart, this middleware checks configs once.
  // When the very first time app.enable('configed') occurs,
  // theme.locals will be rewited.
  function rewriteConfigs(configsInDatabase) {
    theme.locals.site = configsInDatabase;
    // theme.defaultTheme = configsInDatabase.theme;
  }

  // return single route
  function initRoutes(deps) {
    var routes = {};
    Object.keys(routers).forEach(function(route) {
      routes[route] = routers[route](deps);
    });
    return routes;
  }

}