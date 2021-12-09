// @flow
import React from 'react'
import { componentFromStream } from '../..'

// $FlowExpectedError (...)
componentFromStream(1)

// $FlowExpectedError (...)
const result1: number = componentFromStream(() => React.createElement('div'))

componentFromStream(a => a)
