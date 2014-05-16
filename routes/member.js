var roles = {};
roles.admin = '(管理员)';

module.exports = function(deps) {

  var ctrlers = deps.ctrlers;
  var express = deps.express;
  var theme = deps.theme;
  var locals = deps.locals;

  var Member = express.Router();
  var user = ctrlers.user;

  // => /member/:member
  Member.route('/:member')
    // PAGE: show a member's homepage
    .get(function(req, res, next) {
      if (!req.params.member) return next(new Error('404'));
      user.read(req.params.member, function(err, u) {
        if (err) return next(err);
        if (!u) return next(new Error('404'));
        var isMe = res.locals.user && res.locals.user._id == req.params.member;
        var freshman = isMe && !res.locals.user.nickname
        u.showname = u.nickname || '匿名用户';
        if (!u.avatar) u.avatar = locals.url + '/images/avatar.png';
        if (!u.url) u.url = locals.url + '/member/' + u._id;
        u.role = roles[u.type] || '';
        theme.render('/member/single', {
          member: u,
          isMe: isMe,
          freshman: freshman
        }, function(err, html) {
          if (err) return next(err);
          return res.send(html);
        });
      });
    })
    // API: remove a vaild user.
    .delete(function(req, res, next) {
      if (!res.locals.user) return next(new Error('signin required'));
      if (res.locals.user.type !== 'admin') return next(new Error('signin required'));
      user.remove(req.params.member, function(err, uid) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          user: user.body
        });
      });
    });

  // => /member/sync
  Member.post('/sync', function(req, res, next){
    var uu = req.body.user;
    if (!(uu && typeof(uu) == 'object')) return next(new Error('user required'));
    user.findById(req.session.user._id, function(err, u) {
      if (err) return next(err);
      u.nickname = uu.name;
      u.url = uu.url;
      u.avatar = uu.avatar;
      u.save(function(err) {
        if (err) return next(err);
        // 同步本地用户到多说
        user.sync(locals.site.duoshuo, u, function(err, result) {
          if (err) return next(err);
          var result = result.body;
          if (result.code !== 0) return next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.errorMessage));
          req.session.user = u;
          res.json({
            stat: 'ok',
            user: u
          });
        });
      });
    });
  });

  return Member;
  
}