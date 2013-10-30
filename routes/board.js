var board = require('../ctrlers/board');

// PAGE: 列出单个板块
exports.read = function(req, res, next) {
    board.readByUrl(req.params.url, req.params.page, function(err, b) {
        if (!err) {
            if (b) {
                res.render('board', {
                    board: b.board,
                    threads: b.threads,
                    page: b.page
                })
            } else {
                next(new Error('404'))
            }
        } else {
            next(err);
        }
    });
}

// API: 更新板块信息
exports.update = function(req, res, next) {
    board.update(req.params.id, req.body.board, function(err, board) {
        if (!err) {
            res.json({
                stat: 'ok',
                board: board
            })
        } else {
            next(err)
        }
    });
}

// API: 创建板块
exports.create = function(req, res, next) {
    board.create(res.locals.user._id, req.body.board, function(err, baby) {
        if (!err) {
            res.json({
                stat: 'ok',
                board: baby
            });
        } else {
            next(err);
        }
    })
}

// API: 删除板块
exports.remove = function(req, res, next) {
    board.remove(req.params.id, function(err, bid) {
        if (!err) {
            res.json({
                stat: 'ok',
                bid: bid
            })
        } else {
            next(err)
        }
    })
}

// API: 列出所有板块名称和url
exports.ls = function(req,res,next) {
    board.lsName(function(err,boards){
        if (!err) {
            res.json({
                stat: 'ok',
                boards: boards
            })
        } else {
            next(err);
        }
    })
}