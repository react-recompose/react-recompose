import React from 'react'
import { shallow } from 'enzyme'
import { nest, setDisplayName, toClass } from '../'

test('nest nests components from outer to inner', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR PREACT - see react-recompose#41')
    return
  }

  const A = setDisplayName('A')(toClass('div'))
  const B = setDisplayName('B')(toClass('div'))
  const C = setDisplayName('C')(toClass('div'))

  const Nest = nest(A, B, C)

  expect(Nest.displayName).toBe('nest(A, B, C)')

  const wrapper = shallow(<Nest pass="through">Child</Nest>)

  expect(
    wrapper.equals(
      <A pass="through">
        <B pass="through">
          <C pass="through">Child</C>
        </B>
      </A>
    )
  ).toBe(true)
})
