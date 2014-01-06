var marked = require('marked'),
    hljs = require('highlight.js');

marked.setOptions({
    sanitize: true,
    highlight: function(code, lang) {
        return hljs.highlightAuto(code).value;
    }
});

exports = module.exports = function($ctrlers) {

    var thread = $ctrlers.thread,
        board = $ctrlers.board;

    return {
        // 列出所有帖子
        index: function(req, res, next) {
            thread.ls(function(err, ths) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    threads: ths
                });
            })
        },
        // 新增话题页面
        new: function(req, res, next) {
            // 需要添加识别默认板块的逻辑
            if (req.query.bid) {
                board.findById(req.query.bid, function(err, b) {
                    if (err) return next(err);
                    res.render('thread/new', {
                        board: b
                    });
                })
            } else {
                board.readDefault(function(err, b) {
                    if (err) return next(err);
                    res.render('thread/new', {
                        board: b
                    });
                })
            }
        },
        // API：创建话题
        create: function(req, res, next) {
            thread.create(req.body.thread, function(err, baby) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    thread: baby
                });
            })
        },
        // 查看话题页面
        show: function(req, res, next) {
            thread.read(req.params.thread, function(err, t) {
                if (err) return next(err);
                if (!t) return next(new Error('404'));
                t.views = t.views + 1;
                t.save(function(err){
                    // 容忍无法自增浏览数的情况出现，暂时不处理error
                    res.render('thread/index', {
                        thread: t,
                        marked: marked,
                        error: err
                    });
                });
            });
        },
        // 更新帖子页面
        edit: function(req, res, next) {
            thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, thread) {
                if (err) return next(err);
                if (!lz) return next(new Error('404'));
                res.render('thread/edit', {
                    thread: thread
                });
            })
        },
        // API：更新话题
        update: function(req, res, next) {
            thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, th) {
                if (err) return next(err);
                if (!lz) return next(new Error('authed required'));
                var updatedThread = {
                    name: req.body.thread.name,
                    content: req.body.thread.content,
                    pubdate: th.pubdate,
                    views: th.views,
                    board: th.board,
                    lz: th.lz
                };
                if (req.body.thread.media) updatedThread.media = req.body.thread.media;
                thread.update(req.params.thread, updatedThread, function(err, thread) {
                    if (err) return next(err);
                    res.json({
                        stat: 'ok',
                        thread: thread
                    });
                });
            })
        },
        // API：删除话题
        destroy: function(req, res, next) {
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
        }
    }
}