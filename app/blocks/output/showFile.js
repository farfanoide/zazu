import { shell } from 'electron'
import os from 'os'

import Block from '../block'

class ShowFile extends Block {
  constructor(data) {
    super(data)
    this.script = data.script
    this.cwd = data.cwd
  }

  call(state, environment = {}) {
    const fullPath = state.value.replace(/^~/, os.homedir())
    this.logger.log('info', 'Showing File', { fullPath })
    shell.showItemInFolder(fullPath)
    return state.next()
  }
}

export default ShowFile
