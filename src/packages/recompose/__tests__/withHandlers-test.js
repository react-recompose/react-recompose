import React from 'react'
import { fireEvent } from '@testing-library/dom'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { act } from './utils'
import { render } from './testing-library-setup'
import { withHandlers, withState, compose } from '../'

test('withHandlers passes handlers to base component', () => {
  let submittedFormValue
  const enhanceForm = compose(
    withState('value', 'updateValue', ''),
    withHandlers({
      onChange: props => event => {
        props.updateValue(event.target.value)
      },
      onSubmit: props => () => {
        submittedFormValue = props.value
      },
    })
  )

  const Form = enhanceForm(({ value, onChange, onSubmit }) => (
    <form onSubmit={onSubmit}>
      <label>
        Value
        <input type="text" value={value} onChange={onChange} />
      </label>
      <p>{value}</p>
    </form>
  ))

  const { container } = render(<Form />)

  act(() => {
    // with getByRole('textbox') NOT working with Preact
    // fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Yay' } })
    fireEvent.input(container.querySelector('input'), {
      target: { value: 'Yay' },
    })
  })

  expect(container.querySelector('p').innerHTML).toBe('Yay')

  act(() => {
    fireEvent.input(container.querySelector('input'), {
      target: { value: 'Yay!!' },
    })
  })
  expect(container.querySelector('p').innerHTML).toBe('Yay!!')

  fireEvent.submit(container.querySelector('form'))
  expect(submittedFormValue).toBe('Yay!!')
})

test('withHandlers passes immutable handlers', () => {
  const enhance = withHandlers({
    handler: () => () => null,
  })
  const component = sinon.spy(() => null)
  const Div = enhance(component)

  const wrapper = mount(<Div />)
  wrapper.setProps({ foo: 'bar' })

  expect(component.calledTwice).toBe(true)
  expect(component.firstCall.args[0].handler).toBe(
    component.secondCall.args[0].handler
  )
})

test('withHandlers warns if handler is not a higher-order function', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/40
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_REACT_18 || process.env.TEST_WITH_PREACT) {
    /* eslint-disable-next-line no-console */
    console.warn(
      'SKIP FOR REACT 18 & PREACT - see https://github.com/react-recompose/react-recompose/issues/40 & https://github.com/react-recompose/react-recompose/issues/41'
    )
    return
  }

  const error = sinon.stub(console, 'error')

  const Button = withHandlers({
    onClick: () => {},
  })('button')

  const wrapper = mount(<Button />)
  const button = wrapper.find('button')

  expect(() => button.simulate('click')).toThrowError(/undefined/)

  expect(error.firstCall.args[0]).toBe(
    'withHandlers(): Expected a map of higher-order functions. Refer to ' +
      'the docs for more info.'
  )

  /* eslint-disable */
  console.error.restore()
  /* eslint-enable */
})

test('withHandlers allow handers to be a factory', () => {
  const enhance = withHandlers(initialProps => {
    let cache_

    return {
      handler: () => () => {
        if (cache_) {
          return cache_
        }
        cache_ = { ...initialProps }

        return cache_
      },
    }
  })

  const componentHandlers = []
  const componentHandlers2 = []

  const Component = enhance(({ handler }) => {
    componentHandlers.push(handler())
    return null
  })

  const Component2 = enhance(({ handler }) => {
    componentHandlers2.push(handler())
    return null
  })

  const wrapper = mount(<Component hello={'foo'} />)
  wrapper.setProps({ hello: 'bar' })
  expect(componentHandlers[0]).toBe(componentHandlers[1])

  // check that cache is not shared
  mount(<Component2 hello={'foo'} />)
  expect(componentHandlers[0]).toEqual(componentHandlers2[0])
  expect(componentHandlers[0]).not.toBe(componentHandlers2[0])
})
