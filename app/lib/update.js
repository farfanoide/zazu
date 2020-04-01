import semver from 'semver'
import json from './json'
import { shell, app, dialog } from 'electron'

import globalEmitter from './globalEmitter'
import logger from './logger'

const update = {
  _latestVersion: null,

  queueUpdate() {
    const thirtySeconds = 1000 * 30
    setTimeout(() => {
      update.check()
    }, thirtySeconds)
  },

  stallUpdate() {
    const oneDay = 1000 * 60 * 60 * 24
    setTimeout(() => {
      update.check()
    }, oneDay)
  },

  latestVersion() {
    return new Promise((resolve, reject) => {
      if (update._latestVersion) {
        return resolve(update._latestVersion)
      }
      json({
        https: false,
        host: 'zazuapp.org',
        path: '/api/version.json',
      })
        .then((body) => {
          resolve(body.version || app.getVersion())
        })
        .catch((error) => {
          reject(new Error(`Got error: ${error.message}`))
        })
    })
  },

  needsUpdate() {
    return update.latestVersion().then((newestVersion) => {
      return semver.satisfies(newestVersion, `>${app.getVersion()}`) && newestVersion
    })
  },

  check(manualUpdate) {
    update
      .needsUpdate()
      .then((updateVersion) => {
        if (updateVersion) {
          logger.log('info', 'needs zazu software update', { updateVersion })
          globalEmitter.emit('showWindow')
          dialog.showMessageBox(
            {
              type: 'question',
              buttons: ['Ignore', 'Download'],
              defaultId: 1,
              cancelId: 0,
              title: 'Zazu Updater',
              message: 'Zazu ' + updateVersion + ' is available for download!',
              detail: 'Click download to get the newest version of Zazu!',
            },
            (response) => {
              if (response === 1) {
                logger.log('info', 'I need it now!', { updateVersion })
                shell.openExternal('http://zazuapp.org/download/')
              } else {
                logger.log('info', 'Eh, maybe later', { updateVersion })
              }
            },
          )
        } else if (manualUpdate) {
          dialog.showMessageBox({
            type: 'none',
            title: 'Zazu Updater',
            message: 'Your Zazu version is up to date!',
            detail: 'No Zazu Updates were found.',
            buttons: [],
          })
        } else {
          update.stallUpdate()
        }
      })
      .catch((error) => {
        logger.error(error)
      })
  },
}

export default update
