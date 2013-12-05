//                         __     
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ / 
// \___/\__,_/_/ /_/\__,_/\__, /  
//                       /____/   
// 
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : 新浪微博@郭宇 [turing](http://guoyu.me)

var server = require('express-scaffold'),
    configs = require('./configs.getcandy.json'),
    models = require('./models/index'),
    ctrlers = require('./ctrlers/index'),
    routes = require('./routes/index');

new server(configs)
    .models(models)
    .ctrlers(ctrlers)
    .routes(routes)
    .run();