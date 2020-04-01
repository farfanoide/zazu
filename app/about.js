import { app, clipboard, dialog } from 'electron'
import environment from './lib/environment'

const items = [
  { name: 'App Environment', value: environment.name },
  { name: 'App Version', value: app.getVersion() },
  { name: 'Electron Version', value: process.versions.electron },
  { name: 'Node Version', value: process.versions.node },
  { name: 'Chrome Version', value: process.versions.chrome },
]

export function show() {
  const detail = items
    .map((item) => {
      return item.name + ': ' + item.value
    })
    .join('\n')
  dialog.showMessageBox(
    {
      type: 'info',
      message: 'Zazu App',
      detail,
      defaultId: 0,
      buttons: ['Ok', 'Copy'],
    },
    (index) => {
      if (index === 1) {
        clipboard.writeText(detail)
      }
    },
  )
}
