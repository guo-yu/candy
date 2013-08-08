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
        MongoStore = require('connect-mongo')(express),
        ifile = require('ifile'),
        self = this;

    var app = express(),
        MemStore = express.session.MemoryStore;

    // static file config
    ifile.options = {
        gzip: true,
        gzip_min_size: 1024,
        gzip_file: ['js', 'css', 'less', 'html', 'xhtml', 'htm', 'xml', 'json', 'txt'], //gzip压缩的文件后缀名
    }

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
    })
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(ifile.connect([
        ["/", "public", ['js', 'css', 'jpg', 'png', 'gif','woff','ttf','svg']],
    ],function(req,res,is_static){
        res.statusCode = 404;
        res.send('404 Static file Not Found');
    }));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // home
    app.get('/', sign.passport, index);

    // signin & signout
    app.get('/signin', sign.in );
    app.get('/signout', sign.out);

    // board
    app.get('/board/:id', sign.passport, board.read);
    app.post('/board/new', sign.checkJSON, board.create);
    app.post('/board/:id', board.update);
    app.post('/board/:id/remove', sign.checkJSON, board.remove);

    // thread
    app.get('/thread/new', sign.check, thread.new);
    app.get('/thread/:id', sign.passport, thread.read);
    app.post('/thread/new', sign.checkJSON, thread.create);
    app.post('/thread/remove', thread.remove);
    app.post('/thread/:id', thread.update);

    // user
    app.get('/user/:id', sign.passport, user.read);
    app.post('/user/new', user.create);
    app.post('/user/remove', user.remove);
    app.post('/user/sync', sign.check, user.sync);
    app.post('/user/:id', user.update);

    // mime
    app.get('/mime', sign.passport, user.mime);

    // admin
    app.get('/admin', sign.checkMaster, sign.checkAdmin, admin.page);

    // setting
    app.post('/setting', admin.update);

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
    self.config(function() {
        http.createServer(self.app).listen(self.app.get('port'));
    });
}

exports.server = Server;