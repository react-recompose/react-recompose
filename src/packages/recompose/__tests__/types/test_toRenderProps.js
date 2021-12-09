/* @flow */

import * as React from 'react'
import { compose, withProps, toRenderProps, withHandlers } from '../..'
import type { HOC } from '../..'

const enhance: HOC<*, {| +x: number |}> = compose(
  withProps(props => ({
    y: props.x + 1,
  })),
  // $FlowFixMe[incompatible-use] - TBD expected error here?
  withHandlers({
    sayHello: ({ y }) => () => {
      console.log('Hello', y)
    },
  })
)

const WithProps = toRenderProps(enhance)

const Comp = () =>
  <WithProps x={1}>
    {({ y, sayHello }) =>
      <div onClick={() => sayHello()}>
        {y}
      </div>}
  </WithProps>

const Comp2 = () =>
  // $FlowExpectedError (...)
  <WithProps x={'1'}>
    {({ y, sayHello }) =>
      <div onClick={() => sayHello()}>
        {y}
      </div>}
  </WithProps>

// $FlowExpectedError (...) - cannot create `WithProps` element because property `children` is missing in props
const Comp3 = () => <WithProps x={1} />

const Comp4 = () =>
  <WithProps x={1}>
    {({ y, sayHello }) =>
      <div
        onClick={() => {
          ;(sayHello: () => void)

          // $FlowExpectedError (...)
          ;(sayHello: number)
          sayHello()
        }}
      >
        {(y: number)}
        {
          // $FlowExpectedError (...)
          (y: string)
        }
      </div>}
  </WithProps>
