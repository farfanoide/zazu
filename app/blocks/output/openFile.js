import { shell } from 'electron'
import os from 'os'

import Block from '../block'

class OpenFile extends Block {
  constructor(data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call(state, environment = {}) {
    const fullPath = state.value.replace(/^~/, os.homedir())
    this.logger.log('info', 'Opening File', { fullPath })
    shell.openItem(fullPath)
    return state.next()
  }
}

export default OpenFile
