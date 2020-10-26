import './env'

import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'

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
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }))
    this.app.use(express.json({ limit: '2mb' }))
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
          message: errorBag.message
        })
    })
  }

  async start () {
    // Start web server
    http.createServer(this.app)
      .listen(this.app.get('port'), () => {
        logger.info(`Server started at http://${this.app.get('host')}:${this.app.get('port')}`)
      })
  }
}
