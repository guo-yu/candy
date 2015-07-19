//                         __
//   _________ _____  ____/ /_  __
//  / ___/ __ `/ __ \/ __  / / / /
// / /__/ /_/ / / / / /_/ / /_/ /
// \___/\__,_/_/ /_/\__,_/\__, /
//                       /____/
//
// @brief  : a micro bbs system based on duoshuo.com apis
// @author : 新浪微博@郭宇 [turing](http://guoyu.me)

require("babel/register")

// Global dependencies
import path from 'path'

// Express core dependencies
import express from 'express'
import morgan from "morgan"
import multer from 'multer'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { findPath } from './libs/utils' 

// Local modules
import configs from './configs.json'

const app = express()
const env = process.env.NODE_ENV || 'development'
const production = (env === 'production')

// Environments
app.set('env', env)
app.set('views', configs.views)
app.set('view engine', configs['view engine'])
app.set('port', process.env.PORT || 3000)
app.set('view cache', production)

// Middlewares
app.use(morgan(production ? configs.log : 'dev'))
app.use(bodyParser.urlencoded({ extended: false })) // `application/x-www-form-urlencoded`
app.use(bodyParser.json()) // `application/json`
app.use(multer({ dest: configs.uploads }))
app.use(cookieParser(configs.secret))
app.use(express.static(findPath(process.cwd(), './public')))

// Locals
app.locals.URI = production ? 
  (configs.url || configs.uri || 'http://127.0.0.1') :
  'http://127.0.0.1:' + app.get('port');

