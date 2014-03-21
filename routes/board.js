// GET     /board              ->  index
// GET     /board/new          ->  new
// POST    /board              ->  create
// GET     /board/:board       ->  show
// GET     /board/:board/edit  ->  edit
// PUT     /board/:board       ->  update
// DELETE  /board/:board       ->  destroy

module.exports = function(ctrlers, theme) {
  var board = ctrlers.board;
  return {
    // API: 列出所有板块
    index: function(req, res, next) {
      board.lsName(function(err, boards) {
        if (err) return next(err);
        return res.json({
          stat: 'ok',
          boards: boards
        });
      })
    },
    // API: 创建板块
    create: function(req, res, next) {
      if (!res.locals.user) return next(new Error('signin required'));
      board.create(res.locals.user._id, req.body.board, function(err, baby) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          board: baby
        });
      });
    },
    // API: 更新板块信息
    update: function(req, res, next) {
      if (!res.locals.user) return next(new Error('signin required'));
      board.update(req.params.board, req.body.board, function(err, board) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          board: board
        });
      });
    },
    // API: 删除板块
    destroy: function(req, res, next) {
      if (!res.locals.user) return next(new Error('signin required'));
      board.remove(req.params.board, function(err, bid) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          bid: bid
        });
      })
    }
  }
}