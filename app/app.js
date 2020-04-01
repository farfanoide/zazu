import ReactDOM from 'react-dom'
import React from 'react'

import ConfigWrapper from './containers/configWrapper'
import PluginWrapper from './containers/pluginWrapper'

ReactDOM.render(
  <ConfigWrapper>
    <PluginWrapper />
  </ConfigWrapper>,
  document.querySelector('#zazu'),
)

// Catch `esc` or `enter` to avoid alert beep.
document.body.addEventListener('keydown', (error) => {
  return error.key !== 'Enter' && error.key !== 'Escape'
})
