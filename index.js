//                         __
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ /
// \___/\__,_/_/ /_/\__,_/\__, /
//                       /____/
//
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : 新浪微博@郭宇 [turing](http://guoyu.me)

var server = require('express-scaffold');
var configs = require('./configs.json');
var models = require('./models/index');
var ctrlers = require('./ctrlers/index');
var routes = require('./routes/index');

module.exports = Candy;

function Candy(params) {
  this.server = new server(params || configs)
  .models(models)
  .ctrlers(ctrlers)
  .routes(routes)
  .run();
}