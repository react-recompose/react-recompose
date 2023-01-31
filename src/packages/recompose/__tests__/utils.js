import React from 'react'
import setDisplayName from '../setDisplayName'
import wrapDisplayName from '../wrapDisplayName'

/* using require here to support Preact vs React */
/* eslint-disable */
export const { act } = process.env.TEST_WITH_PREACT
  ? require('preact/test-utils')
  : process.env.TEST_WITH_REACT_16
  ? { act: f => f() }
  : require('react-dom/test-utils')
/* eslint-enable */

export const actWith = f => arg => {
  act(() => {
    f(arg)
  })
}

export const countRenders = BaseComponent => {
  class CountRenders extends React.Component {
    renderCount = 0

    render() {
      this.renderCount += 1
      return <BaseComponent renderCount={this.renderCount} {...this.props} />
    }
  }

  return setDisplayName(wrapDisplayName(BaseComponent, 'countRenders'))(
    CountRenders
  )
}
