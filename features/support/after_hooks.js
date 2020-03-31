/* eslint-disable unicorn/filename-case */
const { After, Before } = require('cucumber')
const jetpack = require('fs-jetpack')
const path = require('path')
const { git } = require('../../app/lib/git')

const homeDirectory = path.join(__dirname, '../../test/fixtures/home')
const calcPlugin = path.join(homeDirectory, '.zazu', 'plugins', 'tinytacoteam', 'zazu-calculator')
const fallbackPlugin = path.join(homeDirectory, '.zazu', 'plugins', 'tinytacoteam', 'zazu-fallback')
const databaseFile = path.join(homeDirectory, '.zazu', 'databases', 'installStatus.nedb')
const configFile = path.join(homeDirectory, '.zazurc.json')

Before(function () {
  return git(['checkout', configFile])
    .then(() => {
      jetpack.remove(calcPlugin)
      jetpack.remove(fallbackPlugin)
      return this.close()
    })
    .then(() => {
      return git(['checkout', databaseFile])
    })
    .then(() => {
      const logDirectory = path.join(homeDirectory, '.zazu/log')
      const files = jetpack.list(logDirectory) || []
      return files.map((file) => {
        const logFile = path.join(logDirectory, file)
        jetpack.remove(logFile)
      })
    })
})

After(function (testCase) {
  return this.close()
    .then(() => {
      return git(['checkout', databaseFile])
    })
    .then(() => {
      return git(['checkout', configFile])
    })
})
