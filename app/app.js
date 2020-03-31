const ReactDOM = require('react-dom')
const React = require('react')

const ConfigWrapper = require('./containers/configWrapper')
const PluginWrapper = require('./containers/pluginWrapper')

ReactDOM.render(
  <ConfigWrapper>
    <PluginWrapper />
  </ConfigWrapper>,
  document.querySelector('#zazu'),
)

// Catch `esc` or `enter` to avoid alert beep.
document.body.addEventListener('keydown', error => {
  return error.key !== 'Enter' && error.key !== 'Escape'
})
