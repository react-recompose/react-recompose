// TEMPORARY WORKAROUND for an issue with using Jest:
const { act, render } = process.env.TEST_WITH_PREACT
  ? require('../../../../node_modules/@testing-library/preact/dist/cjs')
  : require('@testing-library/react')
const { prettyDOM } = require('@testing-library/dom')
require('@testing-library/jest-dom')

export { act, render, prettyDOM }
