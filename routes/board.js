import Promise from 'bluebird'
import { isPage } from '../libs/utils'

export default function({ app, express, Board, Thread, theme }) {
  var Route = express.Router()
  var pagelimit = locals.site.pagelimit || 20

  // => /board
  Route.route('/')
    // API: list all public board
    .get((req, res, next) => {
      Board.list('name url')
        .then(boards => {
          res.json({
            stat: 'ok',
            boards
          })
      }).catch(next)
    })
    // API: create a baby board
    .post((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))

      Board
        .create(res.locals.user._id, req.body.board)
        .then(done)
        .catch(next)

      function done(baby) {
        res.json({
          stat: 'ok',
          board: baby
        })
      }
    })

  // => /board/:board
  Route.route('/:board')
    // PAGE: show the query board
    .get(readBoard)
    // API: update board infomation
    .put((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))

      Board
        .update(req.params.board, req.body.board)
        .then(done)
        .catch(next)

      function done(board) {
        res.json({
          stat: 'ok',
          board: board
        })
      }
    })
    // API: remove target board
    .delete((req, res, next) => {
      if (!res.locals.user) 
        return next(new Error('signin required'))

      Board.remove(req.params.board)
        .then(done)
        .catch(next)

      function done(bid) {
        res.json({
          stat: 'ok',
          bid: bid
        })
      }
    })

  // => /board/:board/page/:page
  Route.get('/:board/page/:page', (req, res, next) => {
    var page = isPage(req.params.page) || 1
    // pager of board
    const query = {
      url: req.params.board
    }

    Board.fetch(page, pagelimit, query)
      .then(done)
      .catch(next)

    function done(result) {
      if (!result) 
        return next(new Error('404'))
      if (result.page.max > 1 && result.threads.length === 0) 
        return next(new Error('404'))

      theme.render('/board/index', result, function(err, html) {
        if (err) 
          return next(err)

        return res.send(html)
      })
    }
  })

  return Board
}
