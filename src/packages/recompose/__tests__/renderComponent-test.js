import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { renderComponent, withState, compose, branch } from '../'

test('renderComponent always renders the given component', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/40
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_REACT_18 || process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR REACT 18 & PREACT - see react-recompose#40 & #42')
    return
  }

  const componentA = sinon.spy(() => null)
  const componentB = sinon.spy(() => null)

  const Foobar = compose(
    withState('flip', 'updateFlip', false),
    branch(
      props => props.flip,
      renderComponent(componentA),
      renderComponent(componentB)
    )
  )(null)

  mount(<Foobar />)
  const { updateFlip } = componentB.firstCall.args[0]

  expect(componentB.calledOnce).toBe(true)
  expect(componentA.notCalled).toBe(true)

  updateFlip(true)
  expect(componentB.calledOnce).toBe(true)
  expect(componentA.calledOnce).toBe(true)
})
