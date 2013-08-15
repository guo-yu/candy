var thread = require('../ctrlers/thread'),
    board = require('../ctrlers/board'),
    marked = require('marked');

// 简单的自增计数
var visited = function(thread, cb) {
    thread.views = thread.views + 1;
    thread.save(function(err) {
        if (err) console.log(err)
        cb();
    })
}

// 列出所有帖子
exports.ls = function(req, res, next) {
    thread.ls(function(ths){
        res.json({
            stat: ths != 'error' ? 'ok' : 'error',
            threads: ths
        })
    })
}

// 新增话题页面
exports.new = function(req, res, next) {
    // 需要添加识别默认板块的逻辑
    if (req.query.bid) {
        board.brief(req.query.bid, function(b) {
            res.render('thread/new', {
                board: b
            });
        })
    } else {
        board.readDefault(function(b) {
            res.render('thread/new', {
                board: b
            });
        })
    }
}

// 查看话题页面
exports.read = function(req, res, next) {
    thread.read(req.params.id, function(t) {
        if (t && t != 'error') {
            visited(t, function() {
                res.render('thread/index', {
                    thread: t,
                    marked: marked
                });
            })
        } else {
            res.render('404')
        }
    });
}

// 更新帖子页面
exports.edit = function(req, res, next) {
    thread.checkLz(req.params.id,res.locals.user._id,function(lz,thread){
        if (lz && lz != 'error') {
            res.render('thread/edit',{
                thread: thread
            })
        } else {
            res.render('404')
        }
    })
}

// API：更新话题
exports.update = function(req, res, next) {
    thread.checkLz(req.params.id,res.locals.user._id,function(lz,th){
        if (lz && lz != 'error') {
            th.name = req.body.thread.name;
            th.content = req.body.thread.content;
            thread.update(req.params.id, {
                name: req.body.thread.name,
                content: req.body.thread.content,
                pubdate: th.pubdate,
                views: th.views,
                board: th.board,
                lz: th.lz
            }, function(err,thread) {
                res.json({
                    stat: !err ? 'ok' : 'error',
                    thread: thread,
                    error: err
                })
            });
        } else {
            res.render('500')
        }
    })
}

// API：创建话题
exports.create = function(req, res, next) {
    thread.create(req.body.thread, function(err,baby) {
        res.json({
            stat: !err ? 'ok' : 'error',
            thread: baby,
            error: err
        })
    })
}

// API：删除话题
exports.remove = function(req, res, next) {
    thread.remove(req.params.id, function(thread) {
        res.json({
            stat: thread.stat,
            thread: thread.body
        })
    })
}