const roles = {
  admin: '(管理员)'
}

export default function({ app, express, Thread, theme, Member }) {
  var Route = express.Router()

  // => /member/:member
  Route.route('/:member')
    // PAGE: show a member's homepage
    .get((req, res, next) => {
      if (!req.params.member) 
        return next(new Error('404'))

      Member.read(req.params.member)
        .then(done)
        .catch(next)

      function done(u) {
        if (!u) 
          return next(new Error('404'))

        var isMe = res.locals.user && res.locals.user._id == req.params.member;
        var freshman = isMe && !res.locals.user.nickname

        u.showname = u.nickname || '匿名用户';
        if (!u.avatar) 
          u.avatar = locals.url + '/images/avatar.png';

        if (!u.url) 
          u.url = locals.url + '/member/' + u._id;

        u.role = roles[u.type] || ''

        theme.render('/member/single', {
          member: u,
          isMe: isMe,
          freshman: freshman
        }).then(html => {
          res.send(html)
        }).catch(next)
      }
    })
    // API: remove a vaild user.
    .delete((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))
      if (res.locals.user.type !== 'admin') 
        return next(new Error('signin required'))

      Member.remove(req.params.member)
        .then(done)
        .catch(next)

      function done() {
        res.json({
          stat: 'ok'
        })
      }
    })

  // => /member/sync
  Route.post('/sync', function(req, res, next) {
    var member = req.body.user

    if (!(member && typeof(member) == 'object')) 
      return next(new Error('user required'))

    Member.findByIdAsync(req.session.user._id)
      .then(done)
      .catch(next)

    function done(user) {
      user.nickname = member.name
      user.url = member.url
      user.avatar = member.avatar

      user.save()
        .then(done)
        .catch(next)

      function done(err) {
        if (err) 
          return next(err)

        // sync a member infomation to Duoshuo
        Member.sync(locals.site.duoshuo, user)
          .then(done)
          .catch(next)

        function done(result) {
          // just ignore the sync error for a while.
          // cause api 404.
          // var result = result.body;
          // if (result.code !== 0) return next(new Error('多说用户同步失败，请稍后再试，详细错误：' + result.errorMessage));
          req.session.user = user
          res.json({
            stat: 'ok',
            user
          })
        }
      }
    }
  })

  return Route
}
