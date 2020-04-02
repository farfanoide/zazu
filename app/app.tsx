import ReactDOM from 'react-dom'
import React from 'react'

import ConfigWrapper from './containers/configWrapper'
import PluginWrapper from './containers/pluginWrapper'

const mountPoint = document.querySelector('#zazu')
if (!mountPoint) {
  throw new Error('No dom node with ID #zazu')
}
ReactDOM.render(
  <ConfigWrapper>
    <PluginWrapper />
  </ConfigWrapper>,
  mountPoint,
)

if (document.body) {
  // Catch `esc` or `enter` to avoid alert beep.
  document.body.addEventListener('keydown', (error: KeyboardEvent) => {
    return error.key !== 'Enter' && error.key !== 'Escape'
  })
}
