//    __            __     
//   / /____  _____/ /___ _
//  / __/ _ \/ ___/ / __ `/
// / /_/  __(__  ) / /_/ / 
// \__/\___/____/_/\__,_/  
//
// a micro bbs system based on duoshuo.com apis
// @author : [turingou]                 
// @url: [http://teslaer.com]

var Server = function(params) {

    var express = require('express'),
        path = require('path'),
        MongoStore = require('connect-mongo')(express);

    var app = express(),
        MemStore = express.session.MemoryStore;

    var board = require('./routes/board'),
        thread = require('./routes/thread'),
        user = require('./routes/user'),
        index = require('./routes/index'),
        sign = require('./routes/sign'),
        admin = require('./routes/admin');

    // all environments
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser({
        keepExtensions: true,
        uploadDir: path.join(__dirname, '/uploads')
    }));
    app.use(express.methodOverride());
    app.use(express.cookieParser('tesla'));
    app.use(express.session({
        secret: 'tesla',
        store: new MongoStore({
            db: 'tesla',
            collection: 'sessions'
        })
    }));
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // home
    app.get('/', index);

    // signin & signout
    app.get('/signin', sign.in);
    app.get('/signout', sign.out);

    // board
    app.get('/board/:id', board.read);
    app.post('/board/:id', board.update);
    app.post('/board/new', board.create);
    app.post('/board/:id/remove', board.remove);

    // thread
    app.get('/thread/new', sign.check, thread.new);
    app.get('/thread/:id',thread.read);
    app.post('/thread/new', thread.create);
    app.post('/thread/remove', thread.remove);
    app.post('/thread/:id', thread.update);

    // user
    app.get('/user/:id', user.read);
    app.post('/user/new', user.create);
    app.post('/user/remove', user.remove);
    app.post('/user/sync', sign.check , user.sync);
    app.post('/user/:id', user.update);

    // mime
    app.get('/mime', user.mime);

    // admin
    app.get('/admin', sign.checkAdmin , admin);

    this.app = app;
    this.params = params;
}

Server.prototype.config = function(cb) {

    var config = require('./ctrlers/config'),
        pkg = require('./pkg').fetch('/package.json'),
        self = this,
        params = self.params;

    // setup system params
    var _set = function(c) {
        self.app.locals({
            site: c,
            sys: pkg,
            href: self.app.locals.settings.env == 'development' ? 'http://localhost:' + self.app.locals.settings.port : self.app.locals.site.url
        });
    }

    var read = function(cb) {
        config.read(function(c) {
            _set(c);
            cb();
        });
    }

    if (params && typeof(params) == 'object') {
        config.check(function(count) {
            if (count == 0) {
                config.create(params, function(c) {
                    _set(c);
                    cb();
                });
            } else {
                read(cb);
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
    self.config(function(){
        http.createServer(self.app).listen(self.app.get('port'));
    });
}

exports.server = Server;