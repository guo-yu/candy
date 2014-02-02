var moment = require('moment'),
    Duoshuo = require('duoshuo'),
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
        check = $middlewares.passport.check(true),
        duoshuo = new Duoshuo(app.locals.site.duoshuo);

    var routes = {
        sign: sign($ctrlers),
        signout: $middlewares.passport.signout,
        home: home($ctrlers),
        board: board($ctrlers),
        thread: thread($ctrlers),
        media: media($ctrlers),
        user: user($ctrlers, app.locals),
        pager: page($ctrlers),
        admin: admin($ctrlers, app.locals)
    };

    // middlewares
    app.all('*', passport);
    app.get('*', $middlewares.current);
    app.get('*', $middlewares.install(app, $models.config));

    // locals
    app.locals.moment = moment;
    app.locals.sys = sys;

    // home
    app.get('/', routes.home);

    // signin & signout
    app.get('/sign', routes.sign.sign)
    app.get('/signin', duoshuo.signin(), routes.sign.signin);
    app.get('/signout', routes.signout);

    // board
    app.resource('board', routes.board)
        .add(app.resource('page', routes.pager));

    // thread
    app.resource('thread', routes.thread)
        .add(app.resource('page', routes.pager));

    // media
    app.resource('medias', routes.media);

    // member
    app.resource('member', routes.user);
    app.post('/member/sync', check, routes.user.sync);

    // admin
    app.get('/admin', routes.sign.checkAdmin, routes.admin.page);
    app.post('/setting', routes.admin.update);

};