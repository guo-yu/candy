var board = require('../ctrlers/board');

// read a board, list threads and page
exports.read = function(req,res,next) {
    board.readByUrl(req.params.url,req.params.page,function(b){
        if (b && b != 'error') {
            res.render('board',{
                board: b.board,
                threads: b.threads,
                page: b.page
            })
        }
    });
}

exports.update = function(req,res,next) {
    board.update(req.params.id,req.body.board,function(board){
        res.json({
            stat: board.stat,
            board: board.body
        })
    });
}

exports.create = function(req,res,next) {
    board.create(res.locals.user._id,req.body.board,function(baby){
        res.json(baby)
    })
}

exports.remove = function(req,res,next) {
    board.remove(req.params.id,function(board){
        res.json({
            stat: board.stat,
            board: board.body
        })
    })
}