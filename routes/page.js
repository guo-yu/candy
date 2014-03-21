var perpage = 20;

function isPage(p) {
  if (!p) return false;
  var n = parseInt(p);
  if (isNaN(n)) return false;
  return n;
}

// GET     /page/:page       ->  show
module.exports = function(ctrlers, theme) {

  var board = ctrlers.board;
  var thread = ctrlers.thread;

  return {
    // PAGE: show selected page
    show: function(req, res, next) {
      var alias = req.params.board;
      var page = isPage(req.params.page) || 1;
      if (alias) {
        // pager of board
        var query = {}
        query.url = alias;
        board.fetch(page, perpage, query, function(err, result) {
          if (err) return next(err);
          if (!result) return next(new Error('404'));
          if (result.page.max > 1 && result.threads.length === 0) return next(new Error('404'));
          theme.render('flat/board/index', result, function(err, html) {
            if (err) return next(err);
            return res.send(html);
          });
        });
      } else {
        // pager of thread
        thread.fetch(page, perpage, {}, function(err, threads, pager) {
          if (err) return next(err);
          if (!threads) return next(new Error('404'));
          if (pager.max > 1 && threads.length === 0) return next(new Error('404'));
          theme.render('flat/index', {
            threads: threads,
            page: pager
          }, function(err, html) {
            if (err) return next(err);
            return res.send(html);
          });
        });
      }
    }
  }

}