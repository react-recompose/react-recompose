import { createElement } from 'react'

const componentFromProp = propName => {
  const Component = ({ [propName]: elementType, forwardedRef, ...props }) =>
    createElement(elementType, { ...props, ref: forwardedRef })
  Component.displayName = `componentFromProp(${propName})`
  return Component
}

export default componentFromProp
