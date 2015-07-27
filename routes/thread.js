import marked from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  sanitize: true,
  highlight: function(code, lang) { 
    return hljs.highlightAuto(code).value
  }
})

export default function({ app, express, Thread, Board, theme}) {
  var Route = express.Router()

  // => /thread
  Route.route('/')
    // API：创建话题
    .post((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))
      if (!req.body.thread) 
        return next(new Error('id required'))

      Thread.create(req.body.thread)
        .then(done)
        .catch(next)

      function(baby) {
        res.json({
          stat: 'ok',
          thread: baby
        })
      }
    })

  // => /thread/new
  // PAGE: 查看话题页面
  Route.get('/new', (req, res, next) => {
    if (!res.locals.user) 
      return res.redirect('/sign')

    Board.read(req.query.bid)
      .then(done)
      .catch(next)

    function done(board) {
      const locals = {
        board
      }

      theme.render('/thread/new', locals)
        .then(html => res.send(html))
        .catch(next)
    }
  })

  // => /thread/:thread
  Route.route('/:thread')
    // PAGE: 查看话题页面
    .get((req, res, next) => {
      if (!req.params.thread) 
        return next(new Error('id required'))

      if (!thread.checkId(req.params.thread)) 
        return next(new Error('404'))

      thread.read(req.params.thread)
        .then(done)
        .catch(next)

      function done(err, thread) {
        if (!thread) 
          return next(new Error('404'))

        thread.views += 1
        thread.save(function(err) {
          const locals = {
            thread,
            marked
          }

          theme.render('/thread/index', locals)
            .then(html => res.send(html))
            .catch(next)
        })
      }
    })
    // API：更新话题
    .put((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))

      if (!req.params.thread) 
        return next(new Error('id required'))

      var tid = req.params.thread
      var user = res.locals.user

      Thread.checkLz(tid, user._id)
        .then(done)
        .catch(next)

      function done(lz, th) {
        if (!lz) 
          return next(new Error('authed required'))

        if (req.body.pin) {
          if (user.type !== 'admin') 
            return next(new Error('authed required'))

          Thread.update(tid, {
            pined: req.body.pined,
            level: req.body.level || 0
          }, thread => {
            return res.json({
              stat: 'ok',
              thread: thread
            })
          }).catch(next)

          return
        }

        var updatedThread = {
          name: req.body.thread.name,
          content: req.body.thread.content,
          pubdate: th.pubdate,
          views: th.views,
          board: th.board,
          lz: th.lz
        }

        if (req.body.thread.media) 
          updatedThread.media = req.body.thread.media

        Thread.update(tid, updatedThread)
          .then(done)
          .catch(next)

        function done(thread) {
          res.json({
            stat: 'ok',
            thread
          })
        }
      }
    })
    // API：删除话题
    .delete((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))

      if (!req.params.thread) 
        return next(new Error('id required'))

      Thread.checkLz(req.params.thread, res.locals.user._id)
        .then(done)
        .catch(next)

      function done(lz, th) {
        if (!lz) 
          return next(new Error('authed required'))

        Thread.remove(req.params.thread)
          .then(done)
          .catch(next)

        function done(tid) {
          res.json({
            stat: 'ok',
            tid
          })
        }
      }
    });

  // => /thread/:thread/edit
  // PAGE: 更新帖子页面
  Route.get('/:thread/edit', (req, res, next) => {
    if (!res.locals.user) 
      return res.redirect('/sign')

    if (!req.params.thread) 
      return next(new Error('id required'))

    Thread.checkLz(req.params.thread, res.locals.user._id)
      .then(done)
      .catch(next)

    function done(lz, thread) {
      if (!lz) 
        return next(new Error('404'))

      const locals = {
        thread
      }

      theme.render('/thread/edit', locals)
        .then(html => res.send(html))
        .catch(next)
    }
  })

  return Route
}
