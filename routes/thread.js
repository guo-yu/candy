// GET     /          ->  index
// GET     /new       ->  new
// POST    /          ->  create
// GET     /:id       ->  show
// GET     /:id/edit  ->  edit
// PUT     /:id       ->  update
// DELETE  /:id       ->  destroy

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

    // 简单的自增计数
    var visited = function(thread, cb) {
        thread.views = thread.views + 1;
        thread.save(function(err) {
            if (!err) {
                cb(null)
            } else {
                cb(err)
            }
        })
    }

    return {
        // 列出所有帖子
        index: function(req, res, next) {
            thread.ls(function(err, ths) {
                if (!err) {
                    res.json({
                        stat: 'ok',
                        threads: ths
                    })
                } else {
                    next(err)
                }
            })
        },
        // 新增话题页面
        new: function(req, res, next) {
            // 需要添加识别默认板块的逻辑
            if (req.query.bid) {
                board.findById(req.query.bid, function(err, b) {
                    if (!err) {
                        res.render('thread/new', {
                            board: b
                        });
                    } else {
                        next(err)
                    }
                })
            } else {
                board.readDefault(function(err, b) {
                    if (!err) {
                        res.render('thread/new', {
                            board: b
                        });
                    } else {
                        next(err)
                    }
                })
            }
        },
        // API：创建话题
        create: function(req, res, next) {
            thread.create(req.body.thread, function(err, baby) {
                if (!err) {
                    res.json({
                        stat: 'ok',
                        thread: baby
                    })
                } else {
                    next(err)
                }
            })
        },
        // 查看话题页面
        show: function(req, res, next) {
            thread.read(req.params.thread, function(err, t) {
                if (!err) {
                    if (t) {
                        visited(t, function(err) {
                            // 容忍无法自增浏览数的情况出现，暂时不处理error
                            res.render('thread/index', {
                                thread: t,
                                marked: marked,
                                error: err
                            });
                        })
                    } else {
                        next(new Error('404'))
                    }
                } else {
                    next(err)
                }
            });
        },
        // 更新帖子页面
        edit: function(req, res, next) {
            thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, thread) {
                if (!err) {
                    if (lz) {
                        res.render('thread/edit', {
                            thread: thread
                        })
                    } else {
                        next(new Error('404'))
                    }
                } else {
                    next(err)
                }
            })
        },
        // API：更新话题
        update: function(req, res, next) {
            thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, th) {
                if (!err) {
                    if (lz) {
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
                            if (!err) {
                                res.json({
                                    stat: 'ok',
                                    thread: thread
                                })
                            } else {
                                next(err);
                            }
                        });
                    } else {
                        next(new Error('not authed'))
                    }
                } else {
                    next(err)
                }
            })
        },
        // API：删除话题
        destroy: function(req, res, next) {
            thread.checkLz(req.params.thread, res.locals.user._id, function(err, lz, th) {
                if (!err) {
                    if (lz) {
                        thread.remove(req.params.thread, function(err, tid) {
                            if (!err) {
                                res.json({
                                    stat: 'ok',
                                    tid: tid
                                });
                            } else {
                                next(err);
                            }
                        })
                    } else {
                        next(new Error('not authed'))
                    }
                } else {
                    next(err)
                }
            })
        }
    }
}