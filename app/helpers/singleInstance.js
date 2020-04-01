import { app } from 'electron'
import globalEmitter from '../lib/globalEmitter'

export default () => {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    globalEmitter.emit('showWindow')
  }
}
