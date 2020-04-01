import React from 'react'
import PropTypes from 'prop-types'

class Result extends React.Component {
  click = () => {
    this.props.onClick(this.props.value)
  }

  handleFocus = () => {
    this.props.handleTab(this.props.value)
  }

  shouldComponentUpdate(nextProperties) {
    return (
      nextProperties.active !== this.props.active ||
      nextProperties.value !== this.props.value ||
      nextProperties.onClick !== this.props.onClick
    )
  }

  componentDidUpdate() {
    if (this.props.active) {
      const list = this.el.parentElement
      const listTop = list.offsetTop
      const listHeight = list.offsetHeight
      const elementTop = this.el.getBoundingClientRect().top - listTop
      const elementBottom = elementTop + this.el.offsetHeight
      if (listHeight < elementBottom) {
        this.el.scrollIntoView(false)
      } else if (elementTop < 0) {
        this.el.scrollIntoView(true)
      }
    }
  }

  setReference = (element) => {
    this.el = element
  }

  renderIcon = () => {
    const { value } = this.props
    const isFontAwesome = value.icon.startsWith('fa') && !value.icon.includes('.')

    if (isFontAwesome) {
      return <i className={`icon fa ${value.icon}`} aria-hidden="true" />
    } else {
      return <img className="icon" src={value.icon} role="presentation" alt="" />
    }
  }

  render() {
    const { active, value } = this.props

    return (
      <li
        onClick={this.click}
        className={active ? 'active' : 'inactive'}
        ref={this.setReference}
        tabIndex={0}
        onFocus={this.handleFocus}>
        {this.renderIcon()}
        <h2>{value.title}</h2>
        {value.subtitle && <h3>{value.subtitle}</h3>}
      </li>
    )
  }
}

Result.propTypes = {
  active: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  handleTab: PropTypes.func.isRequired,
}

export default Result
