var async = require('async');
var Duoshuo = require('duoshuo');

module.exports = function(deps) {

  var ctrlers = deps.ctrlers;
  var locals = deps.locals;
  var express = deps.express;

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
  // PAGE: 登入 via duoshuo
  Sign.get('/in', duoshuo.signin(), function(req, res, next) {
    if (!res.locals.duoshuo) return next(new Error('多说登录失败'));
    var result = res.locals.duoshuo;
    // 当返回正确时
    async.waterfall([
      function(callback) {
        user.readByDsId(result.user_id, callback);
      },
      function(u, callback) {
        if (!u) return user.count(callback);
        req.session.user = u;
        return res.redirect('back');
      },
      function(count, callback) {
        if (count == 0) result['type'] = 'admin';
        user.create({
          type: result.type ? result.type : 'normal',
          duoshuo: {
            user_id: result.user_id,
            access_token: result.access_token
          }
        }, function(err, baby) {
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