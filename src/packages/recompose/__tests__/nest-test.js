import React from 'react'
import stripAnsi from 'strip-ansi'
import { render, prettyDOM } from './testing-library-setup'

import { nest, setDisplayName, toClass } from '../'

test('nest nests components from outer to inner', () => {
  const A = setDisplayName('A')(toClass('div'))
  const B = setDisplayName('B')(toClass('div'))
  const C = setDisplayName('C')(toClass('div'))

  const Nest = nest(A, B, C)

  expect(Nest.displayName).toBe('nest(A, B, C)')

  const { container } = render(<Nest pass="through">Child</Nest>)

  expect(stripAnsi(prettyDOM(container))).toMatchInlineSnapshot(`
    "<div>
      <div
        pass="through"
      >
        <div
          pass="through"
        >
          <div
            pass="through"
          >
            Child
          </div>
        </div>
      </div>
    </div>"
  `)

  // FUTURE consideration:
  // cleaner testing like before:
  // expect(
  //   wrapper.equals(
  //     <A pass="through">
  //       <B pass="through">
  //         <C pass="through">Child</C>
  //       </B>
  //     </A>
  //   )
  // ).toBe(true)
})
