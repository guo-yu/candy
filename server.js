//                         __     
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ / 
// \___/\__,_/_/ /_/\__,_/\__, /  
//                       /____/   
// 
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : 新浪微博@郭宇 [turing](http://guoyu.me)

var express = require('express'),
    path = require('path'),
    http = require('http'),
    MongoStore = require('connect-mongo')(express),
    less = require('less-middleware'),
    moment = require('moment'),
    cn = require('./lib/zh-cn'),
    pkg = require('./pkg'),
    sys = require('./package.json');

moment.lang('zh-cn', cn);

var Server = function(params) {

    var app = express(),
        self = this,
        secret = sys.name,
        theme = {
            name: sys.name,
            engine: 'jade'
        };

    if (params.database) pkg.set('/database.json', params.database);
    if (params.database && params.database.name) secret = params.database.name;
    if (params.theme && typeof(params.theme) == 'object') theme = params.theme;

    var board = require('./routes/board'),
        thread = require('./routes/thread'),
        user = require('./routes/user'),
        index = require('./routes/index'),
        sign = require('./routes/sign'),
        admin = require('./routes/admin'),
        media = require('./routes/media'),
        errhandler = require('./lib/error');

    // all environments
    app.set('env', params.env && typeof(params.env) == 'string' ? params.env : 'development');
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', theme.engine);
    app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.limit('20mb'));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '/public/uploads') }));
    app.use(express.methodOverride());
    app.use(express.cookieParser(secret));
    app.use(express.session({ secret: secret, store: new MongoStore({ db: secret, collection: 'sessions' }) }));
    app.use(less({ src: path.join(__dirname, 'public') }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function(req, res, next) {
        if (!res.locals.App) res.locals.App = self;
        next();
    });
    app.use(app.router);

    // errhandler
    app.use(errhandler.logger);
    app.use(errhandler.xhr);
    app.use(errhandler.common);

    // res.locals.xxx
    app.get('*', function(req, res, next) {
        res.locals.moment = moment;
        next();
    });

    // home
    app.get('/', sign.passport, index);

    // signin & signout
    app.get('/signin', sign.signin);
    app.get('/signout', sign.signout);

    // board
    app.get('/board/ls', sign.passport, board.ls);
    app.get('/board/:url', sign.passport, board.read);
    app.get('/board/:url/page/:page', sign.passport, board.read);
    app.post('/board/new', sign.checkJSON, board.create);
    app.post('/board/:id', board.update);
    app.delete('/board/:id/remove', sign.checkJSON, board.remove);

    // thread
    app.get('/thread/new', sign.check, thread.new);
    app.post('/thread/new', sign.checkJSON, thread.create);
    app.get('/thread/list', sign.checkJSON, thread.ls);
    app.get('/thread/:id', sign.passport, thread.read);
    app.get('/thread/:id/edit', sign.check, thread.edit);
    app.post('/thread/:id/update', sign.checkJSON, thread.update);
    app.delete('/thread/:id/remove', sign.checkJSON, thread.remove);

    // media
    app.get('/download/:id', sign.passport, media.download);
    app.post('/upload', sign.checkJSON, media.upload);

    // user
    app.get('/user/:id', sign.passport, user.read);
    app.post('/user/sync', sign.check, user.sync);
    app.post('/user/:id', user.update);
    app.delete('/user/remove', user.remove);

    // user center
    app.get('/member/:id', sign.passport, user.mime);

    // admin
    app.get('/admin', sign.passport, sign.checkAdmin, admin.page);
    app.post('/setting', admin.update);

    // 404
    app.get('*', errhandler.notfound);

    this.app = app;
    this.params = params;

    return this;
}

Server.prototype.config = function(cb) {

    var self = this,
        params = self.params,
        config = require('./ctrlers/config');

    // setup system params
    var setLocals = function(info) {
        self.app.locals.site = info;
        self.app.locals.sys = sys;
    }

    var read = function(cb) {
        config.read(function(err, info) {
            if (!err) {
                setLocals(info);
                cb();
            } else {
                console.log('Setup Error:')
                console.log(error);
            }
        });
    }

    if (params && typeof(params) == 'object') {
        config.check(function(err, count) {
            if (!err) {
                if (count == 0) {
                    // first create
                    config.create(params, function(err, c) {
                        if (!err) {
                            setLocals(c);
                            cb();
                        } else {
                            console.log('Setup Error:')
                        }
                    });
                } else {
                    read(cb);
                }
            } else {
                console.log('Setup Error:')
                console.log(err);
            }
        });
    } else {
        read(cb);
    }
};

Server.prototype.run = function(port) {
    var defaultPort = 3000,
        app = this.app;
    app.set('port', (port && !isNaN(parseInt(port, 10))) ? parseInt(port, 10) : defaultPort);
    app.locals.href = (app.get('env') === 'production') ? this.params.url : 'http://localhost:' + app.get('port');
    this.config(function() {
        http.createServer(app).listen(app.get('port'));
    });
};

module.exports = Server;