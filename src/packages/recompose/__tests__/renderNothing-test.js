import React from 'react'
import { shallow } from 'enzyme'
import { renderNothing } from '../'

test('renderNothing returns a component that renders null', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR PREACT - see react-recompose#41')
    return
  }

  const Nothing = renderNothing('div')
  const wrapper = shallow(<Nothing />)

  const Parent = () => <Nothing />
  const parentWrapper = shallow(<Parent />)

  expect(wrapper.type()).toBe(null)
  expect(parentWrapper.text()).toBe('<Nothing />')
})
