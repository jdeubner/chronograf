import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import {fetchJSONFeedAsync} from 'src/status/actions'

import FancyScrollbar from 'shared/components/FancyScrollbar'
import JSONFeedReader from 'src/status/components/JSONFeedReader'

class NewsFeed extends Component {
  constructor(props) {
    super(props)
  }

  // TODO: implement shouldComponentUpdate based on fetching conditions

  render() {
    const {hasCompletedFetchOnce, isFetching, isFailed, data} = this.props

    if (!hasCompletedFetchOnce) {
      return isFailed
        ? <span>Failed to load NewsFeed.</span>
        : // TODO: Factor this out of here and AutoRefresh
          <div className="graph-fetching">
            <div className="graph-spinner" />
          </div>
    }

    return (
      <FancyScrollbar autoHide={false} className="newsfeed--container">
        {isFetching
          ? // TODO: Factor this out of here and AutoRefresh
            <div className="graph-panel__refreshing">
              <div />
              <div />
              <div />
            </div>
          : null}
        {isFailed ? <span>Failed to refresh NewsFeed</span> : null}
        <JSONFeedReader data={data} />
      </FancyScrollbar>
    )
  }

  // TODO: implement interval polling a la AutoRefresh
  componentDidMount() {
    const {statusFeedURL, fetchJSONFeed} = this.props

    fetchJSONFeed(statusFeedURL)
  }
}

const {bool, func, shape, string} = PropTypes

NewsFeed.propTypes = {
  hasCompletedFetchOnce: bool.isRequired,
  isFetching: bool.isRequired,
  isFailed: bool.isRequired,
  data: shape(),
  fetchJSONFeed: func.isRequired,
  statusFeedURL: string,
}

const mapStateToProps = ({
  links: {external: {statusFeed: statusFeedURL}},
  JSONFeed: {hasCompletedFetchOnce, isFetching, isFailed, data},
}) => ({
  hasCompletedFetchOnce,
  isFetching,
  isFailed,
  data,
  statusFeedURL,
})

const mapDispatchToProps = dispatch => ({
  fetchJSONFeed: bindActionCreators(fetchJSONFeedAsync, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed)