var thread = require('../ctrlers/thread'),
    board = require('../ctrlers/board'),
    marked = require('marked');

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

// 列出所有帖子
exports.ls = function(req, res, next) {
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
}

// 新增话题页面
exports.new = function(req, res, next) {
    // 需要添加识别默认板块的逻辑
    if (req.query.bid) {
        board.brief(req.query.bid, function(err, b) {
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
}

// 查看话题页面
exports.read = function(req, res, next) {
    thread.read(req.params.id, function(err, t) {
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
}

// 更新帖子页面
exports.edit = function(req, res, next) {
    thread.checkLz(req.params.id, res.locals.user._id, function(err, lz, thread) {
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
}

// API：更新话题
exports.update = function(req, res, next) {
    thread.checkLz(req.params.id, res.locals.user._id, function(err, lz, th) {
        if (!err) {
            if (lz) {
                th.name = req.body.thread.name;
                th.content = req.body.thread.content;
                thread.update(req.params.id, {
                    name: req.body.thread.name,
                    content: req.body.thread.content,
                    pubdate: th.pubdate,
                    views: th.views,
                    board: th.board,
                    lz: th.lz
                }, function(err, thread) {
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
}

// API：创建话题
exports.create = function(req, res, next) {
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
}

// API：删除话题
exports.remove = function(req, res, next) {
    thread.checkLz(req.params.id, res.locals.user._id, function(err, lz, th) {
        if (!err) {
            if (lz) {
                thread.remove(req.params.id, function(err,tid) {
                    if (!err) {
                        res.json({
                            stat: 'ok',
                            tid: tid
                        })
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