import React from 'react'
import PropTypes from 'prop-types'

import configuration from '../lib/configuration'
import logger from '../lib/logger'

class ConfigWrapper extends React.Component {
  getChildContext = () => {
    configuration.load()
    return {
      configuration,
      logger,
    }
  }

  render() {
    return this.props.children
  }
}

ConfigWrapper.propTypes = {
  children: PropTypes.node,
}

ConfigWrapper.childContextTypes = {
  configuration: PropTypes.object,
  logger: PropTypes.object,
}

export default ConfigWrapper
