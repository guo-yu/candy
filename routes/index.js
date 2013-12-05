var member = require('member'),
    moment = require('moment'),
    passport = member.passport,
    check = member.check,
    home = require('./home'),
    sign = require('./sign'),
    board = require('./board'),
    thread = require('./thread'),
    user = require('./user'),
    admin = require('./admin'),
    media = require('./media'),
    cn = require('../libs/zh-cn');

moment.lang('zh-cn', cn);

module.exports = function(app, $ctrlers, $middlewares) {

    // middlewares
    app.all('*', member.passport);
    app.get('*', $middlewares.current);
    app.locals.moment = moment;

    // home
    app.get('/', home($ctrlers));

    // signin & signout
    app.get('/signin', $middlewares.locals.app(app), sign($ctrlers).signin);
    app.get('/signout', sign($ctrlers).signout);

    // boards
    // app.resource('boards', board);
    app.get('/board/ls', board($ctrlers).index);
    app.get('/board/:url', board($ctrlers).show);
    app.get('/board/:url/page/:page', board($ctrlers).show);
    app.post('/board/new', check, board($ctrlers).create);
    app.post('/board/:id', check, board($ctrlers).update);
    app.delete('/board/:id/remove', check, board($ctrlers).destroy);

    // threads
    // app.resource('threads', thread);
    app.get('/thread/new', check, thread($ctrlers).new);
    app.post('/thread/new', check, thread($ctrlers).create);
    app.get('/thread/list', check, thread($ctrlers).index);
    app.get('/thread/:id', thread($ctrlers).show);
    app.get('/thread/:id/edit', check, thread($ctrlers).edit);
    app.post('/thread/:id/update', check, thread($ctrlers).update);
    app.delete('/thread/:id/remove', check, thread($ctrlers).destroy);

    // medias
    // app.resource('medias', thread);
    app.get('/download/:id', media($ctrlers).show);
    app.post('/upload', check, media($ctrlers).create);

    // user
    // app.resource('medias', thread);
    app.get('/user/:id', user($ctrlers).show);
    app.post('/user/sync', check, $middlewares.locals.app(app), user($ctrlers).sync);
    app.post('/user/:id', check, user($ctrlers).update);
    app.delete('/user/remove', sign($ctrlers).checkAdmin, user($ctrlers).remove);

    // user center
    app.get('/member/:id', user($ctrlers).mime);

    // admin
    app.get('/admin', sign($ctrlers).checkAdmin, admin($ctrlers).page);
    app.post('/setting', $middlewares.locals.app(app), admin($ctrlers).update);

}