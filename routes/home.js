export default function(deps) {
  var ctrlers = deps.ctrlers
  var express = deps.express
  var locals = deps.locals
  var theme = deps.theme

  var Home = express.Router()
  var thread = ctrlers.thread

  Home.get('/', readThreads)
  Home.get('/page/:page', readThreads)

  return Home

  function readThreads(req, res, next) {
    var page = isPage(req.params.page) || 1
    var pagelimit = locals.site.pagelimit || 20

    thread.fetch(page, pagelimit, {}, function(err, threads, pager) {
      if (err) 
        return next(err)
      if (!threads) 
        return next(new Error('404'))
      if (pager.max > 1 && threads.length === 0) 
        return next(new Error('404'))

      theme.render('/index', {
        threads: threads,
        page: pager
      }, function(err, html) {
        if (err) 
          return next(err)

        return res.send(html)
      })
    })
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
