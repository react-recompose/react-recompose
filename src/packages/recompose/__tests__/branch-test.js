import sinon from 'sinon'
import React from 'react'
import { mount } from 'enzyme'
import { getByText } from '@testing-library/dom'
import { render } from './testing-library-setup'
import { act } from './utils'
import { branch, compose, withState, withProps } from '../'

test('branch tests props and applies one of two HoCs, for true and false', () => {
  const SayMyName = compose(
    withState('isBad', 'updateIsBad', false),
    branch(
      props => props.isBad,
      withProps({ name: 'Heisenberg' }),
      withProps({ name: 'Walter' })
    )
  )(({ isBad, name, updateIsBad }) =>
    <div>
      <div className="isBad">
        {isBad ? 'true' : 'false'}
      </div>
      <div className="name">
        {name}
      </div>
      <button onClick={() => updateIsBad(b => !b)}>Toggle</button>
    </div>
  )

  expect(SayMyName.displayName).toBe('withState(branch(Component))')

  const { container } = render(<SayMyName />)

  expect(container.querySelector('.isBad').innerHTML).toBe('false')
  expect(container.querySelector('.name').innerHTML).toBe('Walter')

  act(() => {
    getByText(container, 'Toggle').click()
  })

  expect(container.querySelector('.isBad').innerHTML).toBe('true')
  expect(container.querySelector('.name').innerHTML).toBe('Heisenberg')
})

test('branch defaults third argument to identity function', () => {
  const Left = () => <div className="left">Left</div>
  const Right = () => <div className="right">Right</div>

  const BranchedComponent = branch(
    () => false,
    () => props => <Left {...props} />
  )(Right)

  const wrapper = mount(<BranchedComponent />)
  const right = wrapper.find('.right').text()

  expect(right).toBe('Right')
})

test('branch third argument should not cause console error', () => {
  const error = sinon.stub(console, 'error')
  const Component = () => <div className="right">Component</div>

  const BranchedComponent = branch(() => false, v => v, v => v)(Component)

  mount(<BranchedComponent />)

  expect(error.called).toBe(false)

  /* eslint-disable */
  error.restore()
  /* eslint-enable */
})
