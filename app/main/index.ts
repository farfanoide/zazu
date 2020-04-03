/* eslint-disable @typescript-eslint/no-misused-promises */
import { dialog, app, globalShortcut, shell } from 'electron'
import path from 'path'

import Screens from '../lib/screens'
import configuration from '../lib/configuration'
import update from '../lib/update'
import globalEmitter from '../lib/globalEmitter'
import logger from '../lib/logger'
import pluginFreshRequire from '../lib/pluginFreshRequire'

import { windowHelper, openCount } from '../helpers/window'
import forceSingleInstance from '../helpers/singleInstance'
import addToStartup from '../helpers/startup'
import { createMenu } from '../helpers/menu'
import { show } from './about'

app.allowRendererProcessReuse = true

globalEmitter.on('showDebug', (message) => {
  logger.log('info', 'opening debug page')
  windowHelper('debug', {
    width: 600,
    height: 400,
    resizable: true,
    title: 'Debug Zazu',
    url: path.join('file://', __dirname, '../renderer', '/debug.html'),
    webPreferences: {
      nodeIntegration: true,
    },
  })
  globalEmitter.emit('debuggerOpened')
})

globalEmitter.on('showAbout', (message) => {
  logger.log('info', 'opening about page')
  show()
})

globalEmitter.on('openPluginFolder', (message) => {
  shell.openItem(configuration.pluginDir)
})
globalEmitter.on('openConfig', (message) => {
  shell.openItem(configuration.profilePath)
})
globalEmitter.on('reloadConfig', (message) => {
  app.relaunch()
  app.exit()
})

globalEmitter.on('pluginFreshRequire', (pluginPath) => {
  pluginFreshRequire(pluginPath)
})

globalEmitter.on('quit', () => app.quit())

app.on('ready', () => {
  if (!configuration.load()) {
    return dialog.showMessageBox(
      {
        type: 'error',
        message: 'You have an invalid ~/.zazurc.json file.',
        detail: 'Please edit your ~/.zazurc.json file and try loading Zazu again.',
        defaultId: 0,
        buttons: ['Ok'],
      },
      () => {
        app.quit()
      },
    )
  }
  logger.debug('app is ready', {
    version: app.getVersion(),
  })
  createMenu()
  update.queueUpdate()
  forceSingleInstance()
  addToStartup(configuration)

  globalEmitter.on('registerHotkey', (accelerator) => {
    if (!globalShortcut.isRegistered(accelerator)) {
      logger.log('verbose', 'registered a hotkey', { hotkey: accelerator })
      try {
        globalShortcut.register(accelerator, () => {
          globalEmitter.emit('triggerHotkey', accelerator)
          logger.log('info', 'triggered a hotkey', { hotkey: accelerator })
        })
      } catch (error) {
        logger.log('error', 'failed to register hotkey', { hotkey: accelerator })
      }
    }
  })

  logger.log('verbose', `registering zazu hotkey: ${configuration.hotkey}`)
  globalShortcut.register(configuration.hotkey, () => {
    logger.log('info', 'triggered zazu hotkey')
    globalEmitter.emit('toggleWindow')
  })

  const debug = !!configuration.debug
  if (debug) logger.log('verbose', 'debug mode is on')

  const windowHeight = configuration.height
  const mainWindow = windowHelper('main', {
    width: 600,
    height: windowHeight,
    maxHeight: windowHeight,
    show: false,
    frame: false,
    resizable: false,
    transparent: true,
    vibrancy: 'light',
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    title: 'Zazu',
    autoResize: true,
    url: path.join('file://', __dirname, '../renderer', '/app.html'),
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
    },
  })

  const screens = Screens.getInstance({
    windowWidth: mainWindow.getSize()[0],
  })

  if (debug) mainWindow.webContents.toggleDevTools({ mode: 'undocked' })

  mainWindow.on('blur', () => {
    logger.log('verbose', 'receiving blur event')
    if (configuration.blur !== false && mainWindow.isVisible()) {
      logger.log('verbose', 'sending hide event signal from blur event')
      globalEmitter.emit('hideWindow')
    }
  })

  globalEmitter.on('hideWindow', () => {
    if (debug) return
    logger.log('info', 'hiding window from manual trigger')
    mainWindow.hide()
  })

  mainWindow.on('hide', () => {
    if (openCount() === 0) {
      app.hide && app.hide()
    }
  })

  mainWindow.on('move', () => {
    const currentWindowPosition = mainWindow.getPosition()
    screens.saveWindowPositionOnCurrentScreen(currentWindowPosition[0], currentWindowPosition[1])
  })

  mainWindow.on('moved', () => {
    const currentWindowPosition = mainWindow.getPosition()
    screens.saveWindowPositionOnCurrentScreen(currentWindowPosition[0], currentWindowPosition[1])
  })

  globalEmitter.on('showWindow', () => {
    logger.log('info', 'showing window from manual trigger')
    const position = screens.getCenterPositionOnCurrentScreen()
    if (position) {
      mainWindow.setPosition(position.x, position.y)
    }
    mainWindow.show()
    mainWindow.focus()
  })

  globalEmitter.on('toggleWindow', () => {
    const type = mainWindow.isVisible() ? 'hideWindow' : 'showWindow'
    logger.log('verbose', `sending ${type} event from toggle event`)
    globalEmitter.emit(type)
  })
})

app.on('will-quit', () => {
  logger.log('verbose', 'zazu is closing')
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll()
  app.quit()
})