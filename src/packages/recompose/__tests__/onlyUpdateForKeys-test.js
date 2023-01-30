import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { onlyUpdateForKeys, compose, withState } from '../'

test('onlyUpdateForKeys implements shouldComponentUpdate()', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/40
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_REACT_18 || process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR REACT 18 & PREACT - see react-recompose#40 & #42')
    return
  }

  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withState('counter', 'updateCounter', 0),
    withState('foobar', 'updateFoobar', 'foobar'),
    onlyUpdateForKeys(['counter'])
  )(component)

  expect(Counter.displayName).toBe(
    'withState(withState(onlyUpdateForKeys(component)))'
  )

  mount(<Counter />)
  const { updateCounter, updateFoobar } = component.firstCall.args[0]

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].foobar).toBe('foobar')

  // Does not update
  updateFoobar('barbaz')
  expect(component.calledOnce).toBe(true)

  updateCounter(42)
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].counter).toBe(42)
  expect(component.lastCall.args[0].foobar).toBe('barbaz')
})
