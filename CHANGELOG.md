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
