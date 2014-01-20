// GET     /page/:page       ->  show

exports = module.exports = function($ctrlers) {

    var board = $ctrlers.board;

    return {
        // PAGE: show selected page
        show: function(req, res, next) {
            if (!req.params.board) return next(new Error('404'));
            if (!board.checkId(req.params.board)) return next(new Error('404'));
            board.readByUrl(req.params.board, req.params.page, function(err, b) {
                if (err) return next(err);
                if (!b) return next(new Error('404'));
                res.render('board', {
                    board: b.board,
                    threads: b.threads,
                    page: b.page
                });
            });
        }
    }

}