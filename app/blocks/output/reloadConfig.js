import globalEmitter from '../../lib/globalEmitter'
import Block from '../block'

class ReloadConfig extends Block {
  constructor(data) {
    super(data)
    this.url = data.url || '{value}'
  }

  call() {
    this.logger.log('info', 'Reloading configuration')
    globalEmitter.emit('reloadConfig')
    return Promise.resolve()
  }
}

export default ReloadConfig
