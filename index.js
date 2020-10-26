import express from 'express'
import config from './src/configs/app'
import Server from './src/server'
import logger from './src/utils/logger'

const app = express()
const server = new Server(app)
server.start(config.port)

// Catch unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection', err)
  process.exit(1)
})

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err)
  process.exit(1)
})
