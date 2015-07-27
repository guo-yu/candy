import Promise from 'bluebird'

export default function({ app, express, Thread }) {
  var Home = express.Router()

  Home.get('/', readThreads)
  Home.get('/page/:page', readThreads)

  return Home

  function readThreads(req, res, next) {
    var page = isPage(req.params.page) || 1
    var pagelimit = locals.site.pagelimit || 20

    Thread.fetch(page, pagelimit)
      .then(({ threads, pager }) {
        if (!threads) 
          return next(new Error('404'))
        if (pager.max > 1 && threads.length === 0) 
          return next(new Error('404'))

        theme.render('/index', {
          threads,
          page: pager
        }).then(html => {
          res.send(html)
        }).catch(next)
      }).catch(next)
  }

}

function isPage(p) {
  if (!p) 
    return false

  var n = parseInt(p)

  if (isNaN(n)) 
    return false

  return n
}
