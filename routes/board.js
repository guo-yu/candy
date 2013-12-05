// GET     /          ->  index
// GET     /new       ->  new
// POST    /          ->  create
// GET     /:id       ->  show
// GET     /:id/edit  ->  edit
// PUT     /:id       ->  update
// DELETE  /:id       ->  destroy

var board = require('../ctrlers/board');

exports.index = function(req,res,next) {
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

// PAGE: 列出单个板块
exports.show = function(req, res, next) {
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

// API: 删除板块
exports.destroy = function(req, res, next) {
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