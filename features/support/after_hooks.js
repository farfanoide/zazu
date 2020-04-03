/* eslint-disable unicorn/filename-case */
import { After, Before, Status } from 'cucumber'
import jetpack from 'fs-jetpack'
import path from 'path'
import git from '../../app/lib/git'

const homeDirectory = path.join(__dirname, '../../test/fixtures/home')
const calcPlugin = path.join(homeDirectory, '.zazu', 'plugins', 'tinytacoteam', 'zazu-calculator')
const fallbackPlugin = path.join(homeDirectory, '.zazu', 'plugins', 'tinytacoteam', 'zazu-fallback')
const databaseFile = path.join(homeDirectory, '.zazu', 'databases', 'installStatus.nedb')
const configFile = path.join(homeDirectory, '.zazurc.json')

Before(function () {
  return git
    .git(['checkout', configFile])
    .then(() => {
      jetpack.remove(calcPlugin)
      jetpack.remove(fallbackPlugin)
      return this.close()
    })
    .then(() => {
      return git.git(['checkout', databaseFile])
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
  return Promise.resolve()
    .then(async () => {
      if (testCase.result.status === Status.FAILED) {
        console.log('main:\n---\n')
        await this.app.client.getMainProcessLogs().then(function (logs) {
          logs.forEach(function (log) {
            console.log(log, '\n')
          })
        })
        console.log('renderer:\n---\n')
        await this.app.client.getRenderProcessLogs().then(function (logs) {
          logs.forEach(function (log) {
            console.log(log.message, '\n')
          })
        })
        console.log('\n')
      }
      return this.close()
    })
    .then(() => {
      return git.git(['checkout', databaseFile])
    })
    .then(() => {
      return git.git(['checkout', configFile])
    })
})
