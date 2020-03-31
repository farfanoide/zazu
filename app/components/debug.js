const React = require('react')
const globalEmitter = require('../lib/globalEmitter')

class Debug extends React.Component {
  constructor(properties) {
    super(properties)

    this.state = {
      selectedPlugin: 'Any',
      selectedLevel: 'info',
      logTypes: ['verbose', 'info', 'warn', 'error'],
      plugins: [],
      items: [],
    }
  }

  log = (options) => {
    const items = Object.assign([], this.state.items)
    const plugins = Object.assign([], this.state.plugins)
    items.unshift(
      Object.assign({}, options, {
        time: new Date(),
      }),
    )
    if (!plugins.includes(options.plugin)) {
      plugins.push(options.plugin)
    }
    this.setState({
      plugins,
      items,
    })
  }

  componentDidMount() {
    globalEmitter.on('pluginLog', (options) => {
      this.log(options)
    })
  }

  componentWillUnmount = () => {
    globalEmitter.removeAllListeners('pluginLog')
  }

  handleTypeChange = (error) => {
    this.setState({
      selectedLevel: error.target.value,
    })
  }

  handlePluginChange = (error) => {
    this.setState({
      selectedPlugin: error.target.value,
    })
  }

  allowedPlugins = () => {
    if (this.state.selectedPlugin === 'Any') return this.state.plugins
    else return [this.state.selectedPlugin]
  }

  allowedLevels = () => {
    if (this.state.selectedLevel === 'error') {
      return ['error']
    } else if (this.state.selectedLevel === 'warn') {
      return ['error', 'warn']
    } else if (this.state.selectedLevel === 'info') {
      return ['error', 'warn', 'info']
    } else if (this.state.selectedLevel === 'verbose') {
      return ['error', 'warn', 'info', 'verbose']
    }
  }

  render() {
    const allowedPlugins = this.allowedPlugins()
    const allowedLevels = this.allowedLevels()

    return (
      <ul>
        <select defaultValue="Any" onChange={this.handlePluginChange}>
          {['Any'].concat(this.state.plugins).map((plugin) => {
            return <option key={plugin}>{plugin}</option>
          })}
        </select>
        <select defaultValue={this.state.selectedLevel} onChange={this.handleTypeChange}>
          {this.state.logTypes.map((logType) => {
            return <option key={logType}>{logType}</option>
          })}
        </select>

        <ul>
          {this.state.items
            .filter((item) => {
              return allowedPlugins.includes(item.plugin) && allowedLevels.includes(item.level)
            })
            .slice(0, 100)
            .map((item, key) => {
              return (
                <li key={key}>
                  <pre className={item.level}>
                    {item.level.toUpperCase()}: [{item.time.toTimeString().split(' ')[0]}] [{item.plugin}{' '}
                    {item.block ? ':' + item.block : ''}]
                  </pre>
                  <pre>{item.message}</pre>
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                </li>
              )
            })}
        </ul>
      </ul>
    )
  }
}

module.exports = Debug
