exports = module.exports = function($ctrlers) {

    var board = $ctrlers.board;

    return {
        index: function(req, res, next) {
            board.lsName(function(err, boards) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    boards: boards
                });
            })
        },
        // API: 创建板块
        create: function(req, res, next) {
            board.create(res.locals.user._id, req.body.board, function(err, baby) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    board: baby
                });
            })
        },
        // PAGE: 列出单个板块
        show: function(req, res, next) {
            board.readByUrl(req.params.url, req.params.page, function(err, b) {
                if (err) return next(err);
                if (!b) return next(new Error('404'));
                res.render('board', {
                    board: b.board,
                    threads: b.threads,
                    page: b.page
                });
            });
        },
        // API: 更新板块信息
        update: function(req, res, next) {
            board.update(req.params.id, req.body.board, function(err, board) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    board: board
                });
            });
        },
        // API: 删除板块
        destroy: function(req, res, next) {
            board.remove(req.params.id, function(err, bid) {
                if (err) return next(err);
                res.json({
                    stat: 'ok',
                    bid: bid
                });
            })
        }
    }
}