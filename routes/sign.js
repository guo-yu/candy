var async = require('async');
var Duoshuo = require('duoshuo');

module.exports = function(deps) {

  var ctrlers = deps.ctrlers;
  var locals = deps.locals;
  var express = deps.express;
  var theme = deps.theme;

  var Sign = express.Router();
  var user = ctrlers.user;
  var duoshuo = new Duoshuo(locals.site.duoshuo);

  // => /sign
  // PAGE: show sign in page.
  Sign.get('/', function(req, res, next){
    if (res.locals.user) return res.redirect('/');
    theme.render('/sign', {}, function(err, html) {
      if (err) return next(err);
      return res.send(html);
    });
  });

  // => /sign/in
  // PAGE: signin via duoshuo
  Sign.get('/in', duoshuo.signin(), function(req, res, next) {
    if (!res.locals.duoshuo) return next(new Error('多说登录失败'));
    var result = res.locals.duoshuo;
    // 当返回正确时
    async.waterfall([
      function(callback) {
        user.readByDsId(result.user_id, callback);
      },
      // check if a vaild exist user.
      function(exist, callback) {
        if (!exist) return callback(null);
        req.session.user = exist;
        return res.redirect('back');
      },
      // fetch new uses' infomation
      function(callback) {
        // just return for a while
        return user.count(callback);
        if (!result.access_token) return user.count(callback);
        var ds = duoshuo.getClient(result.access_token);
        // if access_token vaild
        // this api return a 404 error
        ds.userProfile({}, function(err, body) {
          console.log(err);
          if (err) return user.count(callback);
          console.log(body);
          return user.count(callback);
        });
      },
      // make a user born
      function(count, callback) {
        var newbie = {};
        newbie.duoshuo = {};
        if (result.user_id) newbie.duoshuo.user_id = result.user_id;
        if (result.access_token) newbie.duoshuo.access_token = result.access_token;
        newbie.type = (count == 0) ? 'admin' : 'normal';
        user.create(newbie, function(err, baby) {
          callback(err, count, baby);
        });
      }
    ], function(err, count, baby) {
      if (err) return next(err);
      req.session.user = baby;
      if (count == 0) return res.redirect('/admin/');
      res.redirect('/member/' + req.session.user._id);
    });
  });
  
  // => /sign/out
  Sign.get('/out', deps.middlewares.passport.signout);

  return Sign;

}