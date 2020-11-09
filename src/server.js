import './env'

import http from 'http'
import express from 'express'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cors from 'cors'

import connectToMongoDb from './services/mongoose'
import passport from './services/passport'
import logger from './utils/logger'
import routes from './routes'
import config from './configs/app'

export default class {
  constructor (app) {
    this.app = app
    // Set some defaults.
    this.app.locals.title = config.title
    this.app.locals.version = config.version
    this.app.set('host', config.host)
    this.app.set('port', config.port)
    // Register functional and protective middlewares.
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(cookieParser())
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }))
    this.app.use(express.json({ limit: '2mb' }))
    if (process.env.NODE_ENV === 'production') {
      // Skip CSRF protection on test environments.
      this.app.use(csurf({ cookie: true }))
      this.app.all('*', (req, res, next) => {
        res.cookie('XSRF-TOKEN', req.csrfToken())
        next()
      })
    }
    this.app.use(passport.initialize())
    // Register application routes
    this.app.use(routes)
    // Register universal error handler
    // eslint-disable-next-line no-unused-vars
    this.app.use((error, req, res, next) => {
      const errorBag = { ...error }
      if (errorBag.statusCode === undefined) {
        errorBag.statusCode = 500
      }
      // Log any HTTP error
      logger.error(error.stack)

      return res.status(errorBag.statusCode)
        .json({
          ...errorBag,
          message: errorBag.message,
          i18n_message: 'internal_error',
          status: 'error'
        })
    })
  }

  async start () {
    // connect to Mongo DB and then
    await connectToMongoDb(
      // start web server
      http.createServer(this.app)
        .listen(this.app.get('port'), () => {
          logger.info(`Server started at ${this.app.get('host')}:${this.app.get('port')}`)
        })
    )
  }
}
