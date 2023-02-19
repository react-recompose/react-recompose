import React from 'react'
// import { fireEvent } from '@testing-library/dom'
import { mount } from 'enzyme'
import sinon from 'sinon'

// import { act, actWith } from './utils'
import { actWith } from './utils'
import { render } from './testing-library-setup'

import { compose, withStateHandlers } from '../'

// NOTE: This persist events feature seems to be no longer needed
// with some newer React versions, perhaps should be removed in the future
test('withStateHandlers should persist events passed as argument', () => {
  const contents = ({ value, onChange }) => (
    <div>
      <input type="text" value={value} onChange={onChange} />
      <p>{value}</p>
    </div>
  )

  // ugly hacky workaround solution:
  let triggerChange
  const component = props => {
    triggerChange = actWith(props.onChange)
    return contents(props)
  }

  const InputComponent = withStateHandlers(
    { value: '' },
    {
      onChange: () => e => ({
        value: e.target.value,
      }),
    }
  )(component)

  const { container } = render(<InputComponent />)

  // having this onChange triggerChange call *may* not simulate real situation
  // emulate persist
  triggerChange({
    persist() {
      this.target = { value: 'Yay' }
    },
  })

  expect(container.querySelector('p').innerHTML).toBe('Yay')

  // TODO this does not seem to work with React 16 and some build tests:
  // act(() => {
  //   fireEvent.input(container.querySelector('input'), {
  //     target: { value: 'empty' },
  //   })
  // })
  triggerChange({
    target: { value: 'empty' },
  })
  expect(container.querySelector('p').innerHTML).toBe('empty')
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

// NOTE: It looks like react-recompose does nothing special in this case,
// just that React (not Preact) will log an error in this case.
// FOR FUTURE CONSIDERATION if ract-recompose should explicitly check this?
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
  // stack with React or Preact should log appropriate error message
  // in the end:
  const error = sinon.stub(console, 'error')
  render(<Counter />)
  expect(error.called).toBe(true)
  expect(error.firstCall.args[0]).toMatch(/state.*must.*object.or.null/)
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
