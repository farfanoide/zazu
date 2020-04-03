import React from 'react'
import PropTypes from 'prop-types'

import path from 'path'
import Datastore from 'nestdb'

import Zazu from './zazu'
import resultSorter from '../transforms/resultSorter'

export default class DatabaseWrapper extends React.Component {
  constructor(properties, context) {
    super(properties, context)

    const { configuration } = this.context
    const databasePath = path.join(configuration.databaseDir, 'track.nedb')
    this.state = {
      clickedResults: [],
      database: new Datastore({ filename: databasePath, autoload: true }),
    }
  }

  componentDidMount() {
    this.state.database.find({}).exec((error, clickedResults) => {
      if (error) return
      this.setState({
        clickedResults,
      })
    })
  }

  trackClick = (clickedResult) => {
    this.setState({
      clickedResults: [...this.state.clickedResults].concat(clickedResult),
    })
    this.state.database.insert(clickedResult)
  }

  handleResultClick = (result) => {
    this.trackClick({
      id: result.id,
      pluginName: result.pluginName,
    })
    this.props.handleResultClick(result)
  }

  render() {
    const { handleQueryChange, handleResetQuery, query, theme, results, scopeBlock } = this.props
    return (
      <Zazu
        query={query}
        theme={theme}
        scopeBlock={scopeBlock}
        handleResetQuery={handleResetQuery}
        handleQueryChange={handleQueryChange}
        handleResultClick={this.handleResultClick}
        results={resultSorter.sort(results, this.state.clickedResults)}
      />
    )
  }
}

DatabaseWrapper.propTypes = {
  query: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
  handleQueryChange: PropTypes.func.isRequired,
  handleResultClick: PropTypes.func.isRequired,
  handleResetQuery: PropTypes.func.isRequired,
  scopeBlock: PropTypes.func.isRequired,
}

DatabaseWrapper.contextTypes = {
  configuration: PropTypes.object.isRequired,
}
