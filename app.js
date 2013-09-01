//                         __     
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ / 
// \___/\__,_/_/ /_/\__,_/\__, /  
//                       /____/   
// 
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : 新浪微博@郭宇 [turing](http://guoyu.me)

var Server = function(params) {

    var express = require('express'),
        path = require('path'),
        MongoStore = require('connect-mongo')(express),
        pkg = require('./pkg'),
        self = this;

    var app = express(),
        MemStore = express.session.MemoryStore;

    pkg.set('/database.json', params.database);

    var board = require('./routes/board'),
        thread = require('./routes/thread'),
        user = require('./routes/user'),
        index = require('./routes/index'),
        sign = require('./routes/sign'),
        admin = require('./routes/admin'),
        media = require('./routes/media'),
        errhandler = require('./lib/error'),
        cn = require('./lib/zh-cn'),
        moment = require('moment');

    // all environments
    app.set('env', params.env ? params.env : 'development');
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.limit('20mb'));
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: path.join(__dirname, '/public/uploads')
    }));
    app.use(express.methodOverride());
    app.use(express.cookieParser(params.database.name));
    app.use(express.session({
        secret: params.database.name,
        store: new MongoStore({
            db: params.database.name,
            collection: 'sessions'
        })
    }));
    app.use(function(req, res, next) {
        if (!res.locals.App) {
            res.locals.App = self;
        }
        next();
    });
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);

    // errhandler
    app.use(errhandler.logger);
    app.use(errhandler.xhr);
    app.use(errhandler.common);

    moment.lang('zh-cn', cn);
    app.get('*', function(req, res, next) {
        res.locals.moment = moment;
        next();
    });

    // home
    app.get('/', sign.passport, index);

    // signin & signout
    app.get('/signin', sign.in);
    app.get('/signout', sign.out);

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
    app.post('/upload', sign.checkJSON, media.upload);
    app.get('/download/:id', sign.passport, media.download);

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
    app.get('*', errhandler.notfound)

    this.app = app;
    this.params = params;

}

Server.prototype.config = function(cb) {

    var config = require('./ctrlers/config'),
        pkg = require('./pkg').fetch('/package.json'),
        self = this,
        params = self.params;

    // setup system params
    var setLocals = function(info) {
        self.app.locals({
            site: info,
            sys: pkg,
            href: self.app.locals.settings.env == 'development' ? 'http://localhost:' + self.app.locals.settings.port : params.url
        });
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
    var self = this,
        http = require('http');
    if (port && !isNaN(parseInt(port))) {
        self.app.set('port', parseInt(port));
    } else {
        self.app.set('port', 3000);
    }
    self.config(function() {
        http.createServer(self.app).listen(self.app.get('port'));
    });
}

exports.server = Server;