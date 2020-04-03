import electron from 'electron'
import globalEmitter from '../lib/globalEmitter'
const { BrowserWindow } = process.type === 'renderer' ? electron.remote : electron

const autoResize = (dynamicWindow: electron.BrowserWindow) => {
  const defaultSize = {
    width: dynamicWindow.getSize()[0],
    height: dynamicWindow.getSize()[1],
  }

  let currentHeight = defaultSize.height
  const resize = (height: number) => {
    if (height !== currentHeight) {
      currentHeight = height
      dynamicWindow.setSize(defaultSize.width, height)
    }
  }

  const updateHeight = () => {
    if (!dynamicWindow) {
      return
    }
    dynamicWindow.webContents.executeJavaScript(
      'document.body.children[0].offsetHeight',
      false,
      (mainContentHeight) => {
        resize(mainContentHeight)
      },
    )
  }

  let updateHeightIntervalId: NodeJS.Timeout | null = null
  const clearUpdateHeightInterval = () => {
    if (updateHeightIntervalId) {
      clearInterval(updateHeightIntervalId)
      updateHeightIntervalId = null
    }
  }

  // register updateHeight interval only when dynamicWindow is visible
  const registerUpdateHeightInterval = () => {
    clearUpdateHeightInterval()
    if (dynamicWindow.isVisible()) {
      // avoid 125ms delay and redraw the window right away
      updateHeight()
      updateHeightIntervalId = setInterval(updateHeight, 125)
    }
  }

  dynamicWindow.webContents.on('did-finish-load', () => {
    // remove the interval as soon as the dynamicWindow is not visible or destroyed
    dynamicWindow.on('closed', clearUpdateHeightInterval)
    dynamicWindow.on('hide', clearUpdateHeightInterval)

    // re-register the interval as soon as the window is visible
    dynamicWindow.on('show', () => {
      registerUpdateHeightInterval()
    })

    // if the window is already visible, the interval should be set
    registerUpdateHeightInterval()
  })
}

const namedWindows: { [windowName: string]: electron.BrowserWindow | null } = {}

export const openCount = () => {
  return Object.keys(namedWindows).reduce((memo, windowName) => {
    const namedWindow = namedWindows[windowName]
    if (namedWindow) {
      if (namedWindow.isVisible()) memo++
      if (namedWindow.webContents.isDevToolsOpened()) memo++
    }
    return memo
  }, 0)
}

interface IExtraOptions {
  autoResize?: boolean
  url: string
}
export const windowHelper = (name: string, options: electron.BrowserWindowConstructorOptions & IExtraOptions) => {
  const namedWindow = namedWindows[name]
  if (namedWindow) {
    namedWindow.focus()
    return namedWindow
  }

  const newWindow = new BrowserWindow(options)
  namedWindows[name] = newWindow
  if (options.autoResize) {
    autoResize(newWindow)
  }

  newWindow.on('closed', () => {
    namedWindows[name] = null
    globalEmitter.emit('debuggerClosed')
  })

  newWindow.loadURL(options.url)

  return newWindow
}
