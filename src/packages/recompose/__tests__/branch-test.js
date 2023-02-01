import sinon from 'sinon'
import React from 'react'
import { findDOMNode } from 'react-dom'
import { mount } from 'enzyme'
import { TestUtils } from './utils'
import { branch, compose, withState, withProps } from '../'

const {
  renderIntoDocument,
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag,
  Simulate,
} = TestUtils

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

  // ref:
  // - https://jaketrent.com/post/testing-react-with-jsdom/
  // - https://reactjs.org/docs/test-utils.html#renderintodocument
  // - https://github.com/jsdom/jsdom

  const d = renderIntoDocument(<SayMyName />)
  // const getIsBad = () => wrapper.find('.isBad').text()
  const getIsBad = () =>
    findRenderedDOMComponentWithClass(d, 'isBad').textContent
  // XXX TODO:
  // const getName = () => wrapper.find('.name').text()
  const b = findRenderedDOMComponentWithTag(d, 'button')

  expect(getIsBad()).toBe('false')
  // XXX TODO:
  // expect(getName()).toBe('Walter')

  // XXX TODO FIX LINT:
  /* eslint-disable-next-line */
  Simulate['click'](findDOMNode(b))

  expect(getIsBad()).toBe('true')
  // XXX TODO:
  // expect(getName()).toBe('Heisenberg')
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
