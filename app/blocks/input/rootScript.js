const path = require('path')
const electron = require('electron')

const InputBlock = require('../inputBlock')
const truncateResult = require('../../lib/truncateResult')

class RootScript extends InputBlock {
  constructor(data) {
    super(data)
    try {
      const plugin = electron.remote.require(path.join(data.cwd, data.script))
      this.script = plugin({
        console: this.logger,
        cwd: data.cwd,
      })
    } catch (error) {
      this.script = false
      this.loadError = error
    }
  }

  respondsTo(input, environment = {}) {
    if (!this.script) {
      this.logger.error('Plugin failed to load', this.loadError)
      return false
    }
    const respondsTo = !!this.script.respondsTo(input, environment)
    this.logger.log('verbose', `${respondsTo ? 'r' : 'notR'}espondsTo`, { input, respondsTo })
    return respondsTo
  }

  query(input) {
    return input
  }

  search(input, environment = {}) {
    const query = this.query(input)
    this.logger.log('verbose', 'Executing Script', { query })
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        timeout === this.timeout ? resolve() : reject(new Error('Debounced'))
      }, this.debounce)
      this.timeout = timeout
    })
      .then(() => {
        return this._ensurePromise(this.script.search(query, environment))
      })
      .then((results) => {
        this.logger.log('info', 'Script Results', {
          results: Array.isArray(results) ? results.map(truncateResult) : results,
        })
        return this._validateResults(results.map((result) => Object.assign({}, result, { blockRank: 1 })))
      })
      .catch((error) => {
        if (error.message === 'Debounced') {
          this.logger.log('verbose', error.message, { query, error })
        } else {
          this.logger.error('Script failed', { query, error })
        }
      })
  }
}

module.exports = RootScript
