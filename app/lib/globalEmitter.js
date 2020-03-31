const electron = require('electron')
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {
  on(eventName, listener) {
    super.on(eventName, listener)
    this.ipc.on(eventName, (event, ...arguments_) => {
      listener(...arguments_)
    })
  }
}

class MainEmitter extends MyEmitter {
  constructor() {
    super()
    this.ipc = electron.ipcMain
  }

  emit(eventName, ...arguments_) {
    super.emit(eventName, ...arguments_)
    electron.BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send(eventName, ...arguments_)
    })
  }
}

class RendererEmitter extends MyEmitter {
  constructor() {
    super()
    this.ipc = electron.ipcRenderer
  }

  emit(eventName, ...arguments_) {
    super.emit(eventName, ...arguments_)
    // this takes 3% of time
    this.ipc.send(eventName, ...arguments_)
    // this takes 43% of time
    const currentWindow = electron.remote.getCurrentWindow()
    // getAllWindows() takes 10% of time
    electron.remote.BrowserWindow.getAllWindows().forEach((window) => {
      if (window !== currentWindow) {
        // this takes 42% of time
        window.webContents.send(eventName, ...arguments_)
      }
    })
  }
}

let instance
if (process.type === 'renderer') {
  instance = new RendererEmitter()
} else {
  instance = new MainEmitter()
}
module.exports = instance
