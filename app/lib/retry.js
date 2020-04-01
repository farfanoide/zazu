import logger from '../lib/logger'

const retry = (name, func, options = {}) => {
  const retries = options.retries || 3
  const clean = options.clean || Promise.resolve.bind(Promise)
  let retriesLeft = retries
  const run = function () {
    logger.log('verbose', `${name} has ${retriesLeft} attempts`)
    if (retriesLeft-- === 0) {
      return Promise.reject(new Error(`${name} failed after ${retries} attempts.`))
    }
    return clean().then(() => {
      return func()
        .then((result) => {
          logger.log('verbose', `${name} success`)
          return result
        })
        .catch((error) => {
          logger.error(`${name} failed`, error)
          return run()
        })
    })
  }
  return run()
}

export default retry
