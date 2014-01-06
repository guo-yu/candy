var moment = require('moment'),
    home = require('./home'),
    sign = require('./sign'),
    board = require('./board'),
    thread = require('./thread'),
    user = require('./user'),
    admin = require('./admin'),
    media = require('./media'),
    cn = require('../libs/zh-cn'),
    sys = require('../package.json');

moment.lang('zh-cn', cn);

module.exports = function(app, $models, $ctrlers, $middlewares) {

    var passport = $middlewares.passport.check(),
        check = $middlewares.passport.check(true);

    // middlewares
    app.all('*', passport);
    app.get('*', $middlewares.current);
    app.get('*', $middlewares.install(app, $models.config));

    // locals
    app.locals.moment = moment;
    app.locals.sys = sys;

    // home
    app.get('/', home($ctrlers).index);
    app.get('/page/:page', home($ctrlers).page);

    // signin & signout
    app.get('/signin', $middlewares.locals.app(app), sign($ctrlers).signin);
    app.get('/signout', $middlewares.passport.signout);

    // boards
    // app.resource('boards', board);
    app.get('/board/ls', board($ctrlers).index);
    app.get('/board/:url', board($ctrlers).show);
    app.get('/board/:url/page/:page', board($ctrlers).show);
    app.post('/board/new', check, board($ctrlers).create);
    app.post('/board/:id', check, board($ctrlers).update);
    app.delete('/board/:id/remove', check, board($ctrlers).destroy);

    // threads
    app.resource('thread', thread($ctrlers));
    // app.get('/thread/new', check, thread($ctrlers).new);
    // app.post('/thread/new', check, thread($ctrlers).create);
    // app.get('/thread/list', check, thread($ctrlers).index);
    // app.get('/thread/:id', thread($ctrlers).show);
    // app.get('/thread/:id/edit', check, thread($ctrlers).edit);
    // app.post('/thread/:id/update', check, thread($ctrlers).update);
    // app.delete('/thread/:id/remove', check, thread($ctrlers).destroy);

    // medias
    // app.resource('medias', thread);
    app.get('/download/:id', media($ctrlers).show);
    app.post('/upload', check, media($ctrlers).create);

    // user
    // app.resource('medias', thread);
    app.get('/user/:id', user($ctrlers).show);
    app.post('/user/sync', check, $middlewares.locals.app(app), user($ctrlers).sync);
    app.post('/user/:id', check, user($ctrlers).update);
    app.delete('/user/remove', sign($ctrlers).checkAdmin, user($ctrlers).destroy);

    // user center
    app.get('/member/:id', user($ctrlers).mime);

    // admin
    app.get('/admin', sign($ctrlers).checkAdmin, admin($ctrlers).page);
    app.post('/setting', $middlewares.locals.app(app), admin($ctrlers).update);

}