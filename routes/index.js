// Global Dependencies
import path from 'path'
import Theme from 'theme'
import express from 'express'

// Local Dependencies
import pkg from '../package.json'
import models from '../models'

const home = path.resolve(__dirname, '../')

// routes
const routes = [
  'home',
  'sign',
  'media',
  'board',
  'thread',
  'member',
  'admin'
]

routes.forEach(item => {
  import item from `./${ item }`
})

// models, ctrlers, middlewares, express
export default function(app) {
  var locals = {}

  // Ensure res.render output correct `sys` locals
  app.locals.sys = pkg
  // Ensure theme.render output correct `sys` locals
  locals.sys = pkg
  locals.site = app.locals.site
  // This URL will be changed in different environment:
  // In Dev env , it will be http://localhost:[port]
  // In Production mode, It will be `app.locals.url`
  locals.url = app.locals.url

  // Init themeloader
  var theme = new Theme(home, locals, app.locals.site.theme || 'flat')

  const deps = {
    app,
    express,
    theme,
    locals: app.locals
  }

  // Inject models dep
  Object.keys(models).forEach(item =>
    deps[item] = models[item])

  // Init routers
  const routers = initRoutes(routes, deps)

  // APIs
  routes.forEach(route => {
    if (route === 'home')
      return app.use('/', routers.home)

    app.use(`/${route}`, routers[route])
  })
}

function initRoutes(routes, deps) {
  var ret = {}
  routes.forEach(route => {
    ret[route] = require(`./${ route }`)(deps)
  })
  return ret
}
