import winston from 'winston'
import 'winston-daily-rotate-file'
import File from '../models/File'

const { format } = winston

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: 'info'
    }),
    new winston.transports.DailyRotateFile({
      format: format.combine(format.timestamp(), format.json()),
      maxFiles: '7d',
      level: 'warn',
      dirname: File.locate('logs'),
      datePattern: 'YYYY-MM-DD',
      filename: '%DATE%-vote.log'
    })
  ]
})

export default logger
