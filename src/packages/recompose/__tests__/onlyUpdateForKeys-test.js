import React from 'react'
import sinon from 'sinon'
import { render } from './testing-library-setup'
import { actWith } from './utils'
import { onlyUpdateForKeys, compose, withState } from '../'

test('onlyUpdateForKeys implements shouldComponentUpdate()', () => {
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

  render(<Counter />)
  const updateCounter = actWith(component.firstCall.args[0].updateCounter)
  const updateFoobar = actWith(component.firstCall.args[0].updateFoobar)

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].foobar).toBe('foobar')

  // should not update
  updateFoobar('barbaz')
  expect(component.calledOnce).toBe(true)

  updateCounter(42)
  expect(component.calledTwice).toBe(true)
  expect(component.lastCall.args[0].counter).toBe(42)
  expect(component.lastCall.args[0].foobar).toBe('barbaz')
})
