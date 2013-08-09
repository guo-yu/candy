var thread = require('../ctrlers/thread'),
    board = require('../ctrlers/board');

exports.new = function(req, res, next) {
    // 需要添加识别默认板块的逻辑
    if (req.query.bid) {
        board.brief(req.query.bid, function(b) {
            res.render('thread/new', {
                board: b
            });
        })
    } else {
        board.default(function(b) {
            res.render('thread/new', {
                board: b
            });
        })
    }
}

exports.read = function(req, res, next) {
    thread.read(req.params.id, function(b) {
        if (b) {
            res.render('thread/index', {
                thread: b
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
    thread.create(req.body.thread, function(baby) {
        res.json({
            stat: 'ok',
            thread: baby
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