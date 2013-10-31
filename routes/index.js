var home = require('./home'),
    sign = require('./sign'),
    board = require('./board'),
    thread = require('./thread'),
    user = require('./user'),
    admin = require('./admin'),
    media = require('./media'),
    member = require('member'),
    passport = member.passport,
    check = member.check,
    moment = require('moment'),
    cn = require('../libs/zh-cn'),
    App = require('../middlewares/app');

moment.lang('zh-cn', cn);

module.exports = function(app) {

    app.locals.moment = moment;

    // home
    app.get('/', passport, home);

    // signin & signout
    app.get('/signin', App(app), sign.signin);
    app.get('/signout', sign.signout);

    // board
    app.get('/board/ls', passport, board.ls);
    app.get('/board/:url', passport, board.read);
    app.get('/board/:url/page/:page', passport, board.read);
    app.post('/board/new', check, board.create);
    app.post('/board/:id', check, board.update);
    app.delete('/board/:id/remove', check, board.remove);

    // thread
    app.get('/thread/new', check, thread.new);
    app.post('/thread/new', check, thread.create);
    app.get('/thread/list', check, thread.ls);
    app.get('/thread/:id', passport, thread.read);
    app.get('/thread/:id/edit', check, thread.edit);
    app.post('/thread/:id/update', check, thread.update);
    app.delete('/thread/:id/remove', check, thread.remove);

    // media
    app.get('/download/:id', passport, media.download);
    app.post('/upload', check, media.upload);

    // user
    app.get('/user/:id', passport, user.read);
    app.post('/user/sync', check, App(app), user.sync);
    app.post('/user/:id', user.update);
    app.delete('/user/remove', user.remove);

    // user center
    app.get('/member/:id', passport, user.mime);

    // admin
    app.get('/admin', passport, sign.checkAdmin, admin.page);
    app.post('/setting', App(app), admin.update);

}