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
    Resource = require('express-resource'),
    less = require('less-middleware'),
    json = require('./libs/json'),
    errors = require('./middlewares/error');
    sys = require('./package.json');

var Server = function(configs) {
        
    var app = express(),
        router = require('./routes/index');
        params = configs ? configs : {},
        secret = params.database && params.database.name ? params.database.name : sys.name,
        theme = { name: sys.name, engine: 'jade'};

    if (params.database) json.save(path.join(__dirname, '/database.json'), params.database);
    if (params.theme && typeof(params.theme) == 'object') theme = params.theme;

    // all environments
    app.set('env', params.env && typeof(params.env) == 'string' ? params.env : 'development');
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', theme.engine);
    app.set('view theme', theme.name);
    app.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
    app.use(express.logger('dev'));
    app.use(express.limit('20mb'));
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '/public/uploads') }));
    app.use(express.methodOverride());
    app.use(express.cookieParser(secret));
    app.use(express.session({ secret: secret, store: new MongoStore({ db: secret }) }));
    app.use(less({ src: path.join(__dirname, 'public') }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);

    // errhandler
    app.use(errors.logger);
    app.use(errors.xhr);
    app.use(errors.common);

    // locals
    app.locals.sys = sys;
    app.locals.site = params;

    // router
    router(app);

    // 404
    app.get('*', errors.notfound);

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
        config.check(function(err, installed) {
            if (!err) {
                if (!installed) {
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
    this.config(function() { http.createServer(app).listen(app.get('port')); });
};

module.exports = Server;