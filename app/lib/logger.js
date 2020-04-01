import RotateTransport from 'winston-daily-rotate-file'
import winston from 'winston'
import jetpack from 'fs-jetpack'
import util from 'util'

import configuration from './configuration'
import environment from './environment'

jetpack.dir(configuration.logDir)

const transports = [
  new RotateTransport({
    filename: 'zazu.log',
    dirname: configuration.logDir,
    maxFiles: 3,
  }),
]

if (environment.isRenderer) {
  const PluginTransport = require('./pluginTransport').default
  transports.push(new PluginTransport({}))
}

const logger = winston.createLogger({
  level: 'debug',
  exitOnError: false,
  transports,
})

logger.bindMeta = (data) => {
  return {
    log: (type, message, options) => {
      const mergedOptions = Object.assign({}, options, data)
      logger.log(type, message, mergedOptions)
    },
    error: (message, error) => {
      const mergedOptions = Object.assign({}, data, { error: util.inspect(error) })
      logger.log('error', message, mergedOptions)
    },
  }
}

logger.error = (message, error) => {
  logger.log('error', message, { error: util.inspect(error) })
}

export default logger
