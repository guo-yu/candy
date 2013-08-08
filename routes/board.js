var board = require('../ctrlers/board');

exports.read = function(req,res,next) {
    board.read(req.params.id,function(b){
        res.render('board',{
            user: req.session.user,
            board: b
        })
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
    console.log(req.body);
    board.create(req.body.board,function(baby){
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