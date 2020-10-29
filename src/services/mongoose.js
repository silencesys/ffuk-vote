import Mongoose from 'mongoose'
import config from '../configs/db.mongo'
import logger from '../utils/logger'

Mongoose.Promise = global.Promise

export default async function connectToDb (callback) {
  try {
    await Mongoose.connect(config.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    logger.info('Connected to DB!')
    if (typeof callback === 'function') {
      callback()
    }
  } catch (error) {
    logger.error(error.stack)
  }
}
