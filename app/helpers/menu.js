import { app, BrowserWindow, dialog, Menu, Tray } from 'electron'
import path from 'path'

import configuration from '../lib/configuration'
import globalEmitter from '../lib/globalEmitter'
import Update from '../lib/update'

const openDevelopmentTools = () => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (currentWindow) {
    if (currentWindow.isDevToolsOpened()) {
      currentWindow.closeDevTools()
    }
    currentWindow.openDevTools({
      mode: 'undocked',
    })
  } else {
    dialog.showMessageBox({
      type: 'error',
      message: 'No focused window',
      detail: 'There are currently no focused windows.',
      defaultId: 0,
      buttons: ['Ok'],
    })
  }
}

const appTemplate = [
  {
    label: 'Zazu',
    submenu: [
      { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
      { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' },
      {
        label: 'Toggle Chrome DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: openDevelopmentTools,
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      },
    ],
  },
]

const trayTemplate = [
  {
    label: 'Toggle Zazu',
    click() {
      globalEmitter.emit('toggleWindow')
    },
  },
  { type: 'separator' },
  {
    label: 'About Zazu',
    click() {
      globalEmitter.emit('showAbout')
    },
  },
  { type: 'separator' },
  {
    label: 'Development',
    submenu: [
      {
        label: 'Plugin Debugger',
        click() {
          globalEmitter.emit('showDebug')
        },
      },
      {
        label: 'Chrome DevTools',
        accelerator: 'Alt+CmdOrCtrl+I',
        click: openDevelopmentTools,
      },
    ],
  },
  { type: 'separator' },
  {
    label: 'Check for Updates',
    click: () => {
      Update.check(true)
    },
  },
  {
    label: 'Update Plugins',
    click: () => {
      globalEmitter.emit('updatePlugins')
    },
  },
  {
    label: 'Open Plugin Folder',
    click: () => {
      globalEmitter.emit('openPluginFolder')
    },
  },
  {
    label: 'Open Config',
    click: () => {
      globalEmitter.emit('openConfig')
    },
  },
  {
    label: 'Reload Config',
    click: () => {
      globalEmitter.emit('reloadConfig')
    },
  },
  { type: 'separator' },
  {
    label: 'Quit',
    accelerator: 'CmdOrCtrl+Q',
    click: () => {
      globalEmitter.emit('quit')
    },
  },
]

// Remove "Toggle Zazu" for the exposed menu template
export const menuTemplate = trayTemplate.slice(2)

let tray
export const createMenu = () => {
  if (app.dock) app.dock.hide()
  if (!configuration.hideTrayItem) {
    const iconPath = path.join(__dirname, '..', 'assets', 'images', 'iconTemplate.png')
    tray = new Tray(iconPath)
    tray.setToolTip('Toggle Zazu')
    tray.setContextMenu(Menu.buildFromTemplate(trayTemplate))
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(appTemplate))
}
