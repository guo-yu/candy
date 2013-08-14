//                         __     
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ / 
// \___/\__,_/_/ /_/\__,_/\__, /  
//                       /____/   
// 
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : [turingou](http://guoyu.me)

var Server = function(params) {

    var express = require('express'),
        path = require('path'),
        MongoStore = require('connect-mongo')(express),
        // ifile = require('ifile'),
        pkg = require('./pkg'),
        self = this;

    var app = express(),
        MemStore = express.session.MemoryStore;

    pkg.set('/database.json',params.database);

    // static file config
    // ifile.options = {
    //     gzip: true,
    //     gzip_min_size: 1024,
    //     gzip_file: ['js', 'css', 'less', 'html', 'xhtml', 'htm', 'xml', 'json', 'txt'], //gzip压缩的文件后缀名
    // }

    var board = require('./routes/board'),
        thread = require('./routes/thread'),
        user = require('./routes/user'),
        index = require('./routes/index'),
        sign = require('./routes/sign'),
        admin = require('./routes/admin'),
        cn = require('./lib/zh-cn'),
        moment = require('moment');

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
    // app.use(ifile.connect([
    //     ["/", "public", ['js', 'css', 'jpg', 'png', 'gif','woff','ttf','svg','ico']],
    // ],function(req,res,is_static){
    //     res.statusCode = 404;
    //     res.render('404');
    // }));
    app.use(express.static(path.join(__dirname, 'public')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    moment.lang('zh-cn',cn);
    
    app.get('*', function(req,res,next){
        res.locals.moment = moment;
        next();
    });

    // home
    app.get('/', sign.passport, index);

    // signin & signout
    app.get('/signin', sign.in);
    app.get('/signout', sign.out);

    // board
    app.get('/board/:url', sign.passport, board.read);
    app.get('/board/:url/page/:page', sign.passport, board.read);
    app.post('/board/new', sign.checkJSON, board.create);
    app.post('/board/:id', board.update);
    app.post('/board/:id/remove', sign.checkJSON, board.remove);

    // thread
    app.get('/thread/new', sign.check, thread.new);
    app.get('/thread/list', sign.checkJSON, thread.ls);
    app.get('/thread/:id', sign.passport, thread.read);
    app.post('/thread/new', sign.checkJSON, thread.create);
    app.post('/thread/remove', thread.remove);
    app.post('/thread/:id', thread.update);

    // user
    app.get('/user/:id', sign.passport, user.read);
    // app.post('/user/new', user.create);
    // app.post('/user/remove', user.remove);
    app.post('/user/sync', sign.check, user.sync);
    app.post('/user/:id', user.update);

    // user center
    app.get('/member/:id', sign.passport, user.mime);

    // admin
    app.get('/admin', sign.passport, sign.checkAdmin, admin.page);
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
                // first create
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