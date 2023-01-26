import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'
import { mapProps, withState, compose } from '../'

test('mapProps maps owner props to child props', () => {
  // TODO ref:
  // - https://github.com/react-recompose/react-recompose/issues/40
  // - https://github.com/react-recompose/react-recompose/issues/41
  if (process.env.TEST_WITH_REACT_18 || process.env.TEST_WITH_PREACT) {
    /* eslint-disable-line no-console */
    console.log('SKIP FOR REACT 18 & PREACT - see react-recompose#40 & #42')
    return
  }

  const component = sinon.spy(() => null)
  component.displayName = 'component'

  const StringConcat = compose(
    withState('strings', 'updateStrings', ['do', 're', 'mi']),
    mapProps(({ strings, ...rest }) => ({
      ...rest,
      string: strings.join(''),
    }))
  )(component)

  expect(StringConcat.displayName).toBe('withState(mapProps(component))')

  mount(<StringConcat />)
  const { updateStrings } = component.firstCall.args[0]
  updateStrings(strings => [...strings, 'fa'])

  expect(component.firstCall.args[0].string).toBe('doremi')
  expect(component.secondCall.args[0].string).toBe('doremifa')
})
