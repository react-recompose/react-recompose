import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import { actWith } from './utils'

import { compose, withStateHandlers } from '../'

test('withStateHandlers should persist events passed as argument', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_PREACT) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'SKIP FOR PREACT - see https://github.com/react-recompose/react-recompose/issues/41'
    )
    return
  }

  const component = ({ value, onChange }) =>
    <div>
      <input type="text" value={value} onChange={onChange} />
      <p>
        {value}
      </p>
    </div>

  const InputComponent = withStateHandlers(
    { value: '' },
    {
      onChange: () => e => ({
        value: e.target.value,
      }),
    }
  )(component)

  const wrapper = mount(<InputComponent />)
  const input = wrapper.find('input')
  const output = wrapper.find('p')
  // having that enzyme simulate does not simulate real situation
  // emulate persist
  input.simulate('change', {
    persist() {
      this.target = { value: 'Yay' }
    },
  })
  expect(output.text()).toBe('Yay')

  input.simulate('change', { target: { value: 'empty' } })
  expect(output.text()).toBe('empty')
})

test('withStateHandlers adds a stateful value and a function for updating it', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(
    { counter: 0 },
    {
      updateCounter: ({ counter }) => increment => ({
        counter: counter + increment,
      }),
    }
  )(component)
  expect(Counter.displayName).toBe('withStateHandlers(component)')

  mount(<Counter pass="through" />)
  const updateCounter = actWith(component.firstCall.args[0].updateCounter)

  expect(component.lastCall.args[0].counter).toBe(0)
  expect(component.lastCall.args[0].pass).toBe('through')

  updateCounter(9)
  expect(component.lastCall.args[0].counter).toBe(9)
  updateCounter(1)
  updateCounter(10)

  expect(component.lastCall.args[0].counter).toBe(20)
  expect(component.lastCall.args[0].pass).toBe('through')
})

test('withStateHandlers accepts initialState as function of props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      updateCounter: ({ counter }) => increment => ({
        counter: counter + increment,
      }),
    }
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)
  expect(component.lastCall.args[0].counter).toBe(initialCounter)
})

test('withStateHandlers initial state must be function or object or null or undefined', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_PREACT) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'SKIP FOR PREACT - see https://github.com/react-recompose/react-recompose/issues/41'
    )
    return
  }

  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(1, {})(component)
  // React throws an error
  // expect(() => mount(<Counter />)).toThrow()
  const error = sinon.stub(console, 'error')
  mount(<Counter />)
  expect(error.called).toBe(true)
})

test('withStateHandlers have access to props', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      increment: ({ counter }, { incrementValue }) => () => ({
        counter: counter + incrementValue,
      }),
    }
  )(component)

  const initialCounter = 101
  const incrementValue = 37

  mount(
    <Counter initialCounter={initialCounter} incrementValue={incrementValue} />
  )

  const increment = actWith(component.firstCall.args[0].increment)

  increment()
  expect(component.lastCall.args[0].counter).toBe(
    initialCounter + incrementValue
  )
})

test('withStateHandlers passes immutable state updaters', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      increment: ({ counter }, { incrementValue }) => () => ({
        counter: counter + incrementValue,
      }),
    }
  )(component)

  const initialCounter = 101
  const incrementValue = 37

  mount(
    <Counter initialCounter={initialCounter} incrementValue={incrementValue} />
  )

  const increment = actWith(component.firstCall.args[0].increment)

  increment()
  expect(component.lastCall.args[0].counter).toBe(
    initialCounter + incrementValue
  )
})

test('withStateHandlers does not rerender if state updater returns undefined', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = withStateHandlers(
    ({ initialCounter }) => ({
      counter: initialCounter,
    }),
    {
      updateCounter: ({ counter }) => increment =>
        increment === 0
          ? undefined
          : {
              counter: counter + increment,
            },
    }
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)
  expect(component.callCount).toBe(1)

  const updateCounter = actWith(component.firstCall.args[0].updateCounter)

  updateCounter(1)
  expect(component.callCount).toBe(2)

  updateCounter(0)
  expect(component.callCount).toBe(2)
})

test('withStateHandlers rerenders if parent props changed', () => {
  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const Counter = compose(
    withStateHandlers(
      ({ initialCounter }) => ({
        counter: initialCounter,
      }),
      {
        increment: ({ counter }) => incrementValue => ({
          counter: counter + incrementValue,
        }),
      }
    ),
    withStateHandlers(
      { incrementValue: 1 },
      {
        // updates parent state and return undefined
        updateParentIncrement: ({ incrementValue }, { increment }) => () => {
          increment(incrementValue)
          return undefined
        },
      }
    )
  )(component)

  const initialCounter = 101

  mount(<Counter initialCounter={initialCounter} />)

  const updateParentIncrement = actWith(
    component.firstCall.args[0].updateParentIncrement
  )

  updateParentIncrement()
  expect(component.lastCall.args[0].counter).toBe(initialCounter + 1)
})
