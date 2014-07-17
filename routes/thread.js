var marked = require('marked');
var hljs = require('highlight.js');

marked.setOptions({
  sanitize: true,
  highlight: function(code, lang) { return hljs.highlightAuto(code).value; }
});

module.exports = threadRouter;

function threadRouter(deps) {

  var ctrlers = deps.ctrlers;
  var express = deps.express;
  var theme = deps.theme;

  var Thread = express.Router();
  var thread = ctrlers.thread;
  var board = ctrlers.board;

  // => /thread
  Thread.route('/')
    // API：创建话题
    .post(function(req, res, next){
      if (!res.locals.user) return next(new Error('signin required'));
      if (!req.body.thread) return next(new Error('id required'));
      thread.create(req.body.thread, function(err, baby) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          thread: baby
        });
      })
    });

  // => /thread/new
  // PAGE: 查看话题页面
  Thread.get('/new', function(req, res, next) {
    if (!res.locals.user) return res.redirect('/sign');
    board.read(req.query.bid, function(err, b) {
      if (err) return next(err);
      theme.render('/thread/new', {
        board: b
      }, function(err, html) {
        if (err) return next(err);
        return res.send(html);
      });
    });
  });

  // => /thread/:thread
  Thread.route('/:thread')
    // PAGE: 查看话题页面
    .get(function(req, res, next){
      if (!req.params.thread) return next(new Error('id required'));
      if (!thread.checkId(req.params.thread)) return next(new Error('404'));
      thread.read(req.params.thread, function(err, t) {
        if (err) return next(err);
        if (!t) return next(new Error('404'));
        t.views = t.views + 1;
        t.save(function(err) {
          theme.render('/thread/index', {
            thread: t,
            marked: marked
          }, function(err, html) {
            if (err) return next(err);
            return res.send(html);
          });
        });
      });
    })
    // API：更新话题
    .put(function(req, res, next){
      if (!res.locals.user) return next(new Error('signin required'));
      if (!req.params.thread) return next(new Error('id required'));
      var tid = req.params.thread;
      var user = res.locals.user;
      thread.checkLz(tid, user._id, function(err, lz, th) {
        if (err) return next(err);
        if (!lz) return next(new Error('authed required'));
        if (req.body.pin) {
          if (user.type !== 'admin') return next(new Error('authed required'));
          return thread.update(tid, {
            pined: req.body.pined,
            level: req.body.level || 0
          }, function(err, thread) {
            if (err) return next(err);
            return res.json({
              stat: 'ok',
              thread: thread
            })
          })
        }
        var updatedThread = {
          name: req.body.thread.name,
          content: req.body.thread.content,
          pubdate: th.pubdate,
          views: th.views,
          board: th.board,
          lz: th.lz
        };
        if (req.body.thread.media) updatedThread.media = req.body.thread.media;
        thread.update(tid, updatedThread, function(err, thread) {
          if (err) return next(err);
          res.json({
            stat: 'ok',
            thread: thread
          });
        });
      })
    })
    // API：删除话题
    .delete(function(req, res, next){
      if (!res.locals.user) return next(new Error('signin required'));
      if (!req.params.thread) return next(new Error('id required'));
      thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, th) {
        if (err) return next(err);
        if (!lz) return next(new Error('authed required'));
        thread.remove(req.params.thread, function(err, tid) {
          if (err) return next(err);
          res.json({
            stat: 'ok',
            tid: tid
          });
        });
      })
    });

  // => /thread/:thread/edit
  // PAGE: 更新帖子页面
  Thread.get('/:thread/edit', function(req, res, next){
    if (!res.locals.user) return res.redirect('/sign');
    if (!req.params.thread) return next(new Error('id required'));
    thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, thread) {
      if (err) return next(err);
      if (!lz) return next(new Error('404'));
      theme.render('/thread/edit', {
        thread: thread
      }, function(err, html) {
        if (err) return next(err);
        return res.send(html);
      });
    });
  });

  return Thread;

}
