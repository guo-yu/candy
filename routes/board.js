module.exports = function(deps) {

  var ctrlers = deps.ctrlers;
  var express = deps.express;
  var theme = deps.theme;
  var locals = deps.locals;

  var Board = express.Router();
  var board = ctrlers.board;

  var pagelimit = locals.site.pagelimit || 20;

  // => /board
  Board.route('/')
    // API: list all public board
    .get(function(req, res, next) {
      board.lsName(function(err, boards) {
        if (err) return next(err);
        return res.json({
          stat: 'ok',
          boards: boards
        });
      })
    })
    // API: create a baby board
    .post(function(req, res, next) {
      if (!res.locals.user) return next(new Error('signin required'));
      board.create(res.locals.user._id, req.body.board, function(err, baby) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          board: baby
        });
      });
    });

  // => /board/:board
  Board.route('/:board')
    // PAGE: show the query board
    .get(readBoard)
    // API: update board infomation
    .put(function(req, res, next){
      if (!res.locals.user) return next(new Error('signin required'));
      board.update(req.params.board, req.body.board, function(err, board) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          board: board
        });
      });
    })
    // API: remove target board
    .delete(function(req, res, next){
      if (!res.locals.user) return next(new Error('signin required'));
      board.remove(req.params.board, function(err, bid) {
        if (err) return next(err);
        res.json({
          stat: 'ok',
          bid: bid
        });
      })
    });

  // => /board/:board/page/:page
  Board.get('/:board/page/:page', readBoard);

  return Board;

  function readBoard(req, res, next) {
    var page = isPage(req.params.page) || 1;
    // pager of board
    var query = {}
    query.url = req.params.board;
    board.fetch(page, pagelimit, query, function(err, result) {
      if (err) return next(err);
      if (!result) return next(new Error('404'));
      if (result.page.max > 1 && result.threads.length === 0) return next(new Error('404'));
      theme.render('/board/index', result, function(err, html) {
        if (err) return next(err);
        return res.send(html);
      });
    });
  }

}

function isPage(p) {
  if (!p) return false;
  var n = parseInt(p);
  if (isNaN(n)) return false;
  return n;
}