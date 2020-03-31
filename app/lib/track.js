const configuration = require('../lib/configuration')
const noop = require('./track/noop')
const newrelic = require('./track/newrelic')
const environment = require('./env.js')

configuration.load()

const disabledAnalytics = configuration.disableAnalytics
const isTesting = environment.name === 'test'

module.exports = (isTesting || disabledAnalytics) ? noop : newrelic
