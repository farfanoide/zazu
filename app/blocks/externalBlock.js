const EventEmitter = require('events')
const cuid = require('cuid')

const logger = require('../lib/logger')

class ExternalBlock extends EventEmitter {
  constructor (data, options) {
    super()
    this.pluginId = data.pluginId
    this.id = data.id || cuid()
    this.logger = logger.bindMeta({ plugin: data.pluginId, block: this.id })
  }

  _ensurePromise (value) {
    if (!(value instanceof Promise)) {
      this.logger.log('error', 'Block did not return a Promise')
      return Promise.resolve()
    }
    return value
  }

  call () {
    return Promise.resolve()
  }
}

module.exports = ExternalBlock
