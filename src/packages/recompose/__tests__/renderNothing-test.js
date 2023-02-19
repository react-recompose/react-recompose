import React from 'react'
import stripAnsi from 'strip-ansi'
import { render, prettyDOM } from './testing-library-setup'
import { renderNothing } from '../'

test('renderNothing returns a component that renders null', () => {
  const Nothing = renderNothing('div')
  const { container: nothingContainer } = render(<Nothing />)

  const Parent = () => <Nothing />
  const { container: parentContainer } = render(<Parent />)

  const BigParent = () => (
    <h1>
      <Nothing />
      <div />
      <Nothing />
    </h1>
  )
  const { container: bigParentContainer } = render(<BigParent />)

  // FUTURE consideration:
  // cleaner testing like before:
  // expect(wrapper.type()).toBe(null)
  // expect(parentWrapper.text()).toBe('<Nothing />')

  expect(stripAnsi(prettyDOM(nothingContainer))).toMatchInlineSnapshot(
    `"<div />"`
  )

  expect(stripAnsi(prettyDOM(parentContainer))).toMatchInlineSnapshot(
    `"<div />"`
  )

  expect(stripAnsi(prettyDOM(bigParentContainer))).toMatchInlineSnapshot(`
    "<div>
      <h1>
        <div />
      </h1>
    </div>"
  `)
})
