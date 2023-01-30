import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { createSink, compose, withState, mapProps } from '../'

test('createSink creates a React component that fires a callback when receiving new props', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/40
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_REACT_18 || process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR REACT 18 & PREACT - see react-recompose#40 & #42')
    return
  }

  const spy = sinon.spy()
  const Sink = createSink(spy)
  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    mapProps(({ updateCounter, ...rest }) => ({
      increment: () => updateCounter(n => n + 1),
      ...rest,
    }))
  )(Sink)

  mount(
    <div>
      <Counter />
    </div>
  )

  const { increment } = spy.lastCall.args[0]
  const getCounter = () => spy.lastCall.args[0].counter
  expect(getCounter()).toBe(0)
  increment()
  expect(getCounter()).toBe(1)
  increment()
  expect(getCounter()).toBe(2)
})
