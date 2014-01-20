var moment = require('moment'),
    home = require('./home'),
    sign = require('./sign'),
    board = require('./board'),
    thread = require('./thread'),
    user = require('./user'),
    page = require('./page'),
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
    app.get('/signin', sign($ctrlers, app.locals).signin);
    app.get('/signout', $middlewares.passport.signout);

    // board
    app.resource('board', board($ctrlers))
       .add(app.resource('page', page($ctrlers)));

    // thread
    app.resource('thread', thread($ctrlers));

    // media
    app.resource('medias', media($ctrlers));

    // member
    app.resource('member', user($ctrlers));
    app.post('/member/sync', check, user($ctrlers, app.locals).sync);

    // admin
    app.get('/admin', sign($ctrlers).checkAdmin, admin($ctrlers).page);
    app.post('/setting', $middlewares.locals.app(app), admin($ctrlers).update);

};
