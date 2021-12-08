## react-recompose v0.31.2

- fix: update dependencies
  - @babel/runtime -> ^7.16.3
  - hoist-non-react-statics -> ^2.5.5
  - react-lifecycles-compat -> ^3.0.4
  - symbol-observable -> ^1.2.0

## react-recompose v0.31.1

- build: update devDependencies, yarn.lock & size snapshot
  - updates and modernizes many devDependencies, as originally proposed in:
    - https://github.com/acdlite/recompose/pull/826
  - completely removes dev dependency on fbjs from yarn.lock ref:
    - https://github.com/acdlite/recompose/issues/825
  - should resolve other reported vulnerability warnings from dev dependencies ref:
    - https://github.com/acdlite/recompose/issues/817
  - resolves a large number of other Yarn dev audit warnings
- Clarify API docs about Relay classic
  - PR: https://github.com/acdlite/recompose/pull/753
  - issue: https://github.com/acdlite/recompose/issues/743
- Add links to HOC criticism
  - original source: https://github.com/acdlite/recompose/pull/531
- include the correct README.md for react-recompose in the npm package build

## react-recompose v0.31.0

based on: recompose v0.30.0

- replace use of React.createFactory
  - PR: https://github.com/acdlite/recompose/pull/795
  - issue: https://github.com/acdlite/recompose/issues/806
- support React 17
  - PR: https://github.com/acdlite/recompose/pull/821
  - issue: https://github.com/acdlite/recompose/issues/827
- documentation updates from these PRs:
  - https://github.com/acdlite/recompose/pull/791
  - https://github.com/acdlite/recompose/pull/798
  - https://github.com/acdlite/recompose/pull/811
- refactor: enable prefer-destructuring rule & update src
- sort recompose-relay peerDependencies
- remove lodash from recompose-relay (not needed)
- docs: add licenses of dependencies bundled in dist
- post-v0.30.0 updates from master branch of https://github.com/acdlite/recompose
  - remove fbjs from recompose dependencies
    - PR: https://github.com/acdlite/recompose/pull/744
    - issue: https://github.com/acdlite/recompose/issues/742
  - enable flow strict in index.js.flow
    - PR: https://github.com/acdlite/recompose/pull/745
  - documentation updates from these PRs:
    - https://github.com/acdlite/recompose/pull/765
    - https://github.com/acdlite/recompose/pull/746
