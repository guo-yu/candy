var home = require('./home'),
    sign = require('./sign'),
    board = require('./board'),
    thread = require('./thread'),
    user = require('./user'),
    admin = require('./admin'),
    media = require('./media'),
    moment = require('moment'),
    cn = require('../libs/zh-cn'),
    App = require('../middlewares/app');

moment.lang('zh-cn', cn);

module.exports = function(app) {

    app.locals.moment = moment;
    
    // home
    app.get('/', sign.passport, home);

    // signin & signout
    app.get('/signin', App, sign.signin);
    app.get('/signout', sign.signout);

    // board
    app.get('/board/ls', sign.passport, board.ls);
    app.get('/board/:url', sign.passport, board.read);
    app.get('/board/:url/page/:page', sign.passport, board.read);
    app.post('/board/new', sign.check, board.create);
    app.post('/board/:id', board.update);
    app.delete('/board/:id/remove', sign.check, board.remove);

    // thread
    app.get('/thread/new', sign.check, thread.new);
    app.post('/thread/new', sign.check, thread.create);
    app.get('/thread/list', sign.check, thread.ls);
    app.get('/thread/:id', sign.passport, thread.read);
    app.get('/thread/:id/edit', sign.check, thread.edit);
    app.post('/thread/:id/update', sign.check, thread.update);
    app.delete('/thread/:id/remove', sign.check, thread.remove);

    // media
    app.get('/download/:id', sign.passport, media.download);
    app.post('/upload', sign.check, media.upload);

    // user
    app.get('/user/:id', sign.passport, user.read);
    app.post('/user/sync', sign.check, App, user.sync);
    app.post('/user/:id', user.update);
    app.delete('/user/remove', user.remove);

    // user center
    app.get('/member/:id', sign.passport, user.mime);

    // admin
    app.get('/admin', sign.passport, sign.checkAdmin, admin.page);
    app.post('/setting', App, admin.update);

}