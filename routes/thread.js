var thread = require('../ctrlers/thread'),
    board = require('../ctrlers/board'),
    marked = require('marked');

var visited = function(thread, cb) {
    thread.views = thread.views + 1;
    thread.save(function(err) {
        if (err) console.log(err)
        cb();
    })
}

exports.ls = function(req, res, next) {
    thread.ls(function(ths){
        res.json({
            stat: ths != 'error' ? 'ok' : 'error',
            threads: ths
        })
    })
}

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

// read a thread
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

exports.update = function(req, res, next) {
    thread.update(req.params.id, req.body.thread, function(thread) {
        res.json({
            stat: thread.stat,
            thread: thread.body
        })
    });
}

exports.create = function(req, res, next) {
    thread.create(req.body.thread, function(err,baby) {
        res.json({
            stat: !err ? 'ok' : 'error',
            thread: baby,
            error: err
        })
    })
}

exports.remove = function(req, res, next) {
    thread.remove(req.params.id, function(thread) {
        res.json({
            stat: thread.stat,
            thread: thread.body
        })
    })
}