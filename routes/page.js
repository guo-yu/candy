// GET     /page/:page       ->  show
exports = module.exports = function($ctrlers) {

    var board = $ctrlers.board,
        thread = $ctrlers.thread;

    return {
        // PAGE: show selected page
        show: function(req, res, next) {
            if (!req.params.page) return next(new Error('404'));
            if (!isNaN(parseInt(req.params.page))) return next(new Error('404'));
            if (!req.params.thread) return next(new Error('404'));
            if (!req.params.board) return next(new Error('404'));
            var page = parseInt(req.params.page);
            if (req.params.board) {
                // pager of board
                if (!board.checkId(req.params.board)) return next(new Error('404'));
                board.readByUrl(req.params.board, page, function(err, b) {
                    if (err) return next(err);
                    if (!b) return next(new Error('404'));
                    res.render('board', {
                        board: b.board,
                        threads: b.threads,
                        page: b.page
                    });
                });
            } else {
                // pager of thread
                thread.fetchByPage(page, 20, {}, function(err, threads, pager) {
                    if (err) return next(err);
                    if (!threads) return next(new Error('404'));
                    if (threads.length === 0) return next(new Error('404'));
                    res.render('index', {
                        threads: threads,
                        pager: pager
                    });
                });
            }
        }
    }

}