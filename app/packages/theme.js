import notification from '../lib/notification'
import Package from './package'
import jetpack from 'fs-jetpack'
import path from 'path'

class Theme extends Package {
  constructor(url) {
    super(url)
    this.loaded = false
  }

  update() {
    return super.update().catch((error) => {
      notification.push({
        title: 'Theme update failed',
        message: error.message,
      })
    })
  }

  load() {
    return super
      .load()
      .then((plugin) => {
        this.logger.log('info', 'loading css for theme')
        this.css = plugin.css = jetpack.read(path.join(this.path, plugin.stylesheet))
        return plugin
      })
      .catch((error) => {
        notification.push({
          title: 'Theme install failed',
          message: error,
        })
      })
  }
}

export default Theme
