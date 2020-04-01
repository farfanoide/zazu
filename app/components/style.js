import React from 'react'
import PropTypes from 'prop-types'

const Style = ({ css }) => {
  return React.createElement('style', null, css)
}

Style.propTypes = {
  css: PropTypes.string.isRequired,
}

export default Style
