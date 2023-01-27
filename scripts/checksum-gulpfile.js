const { src, dest } = require('gulp')
const concat = require('gulp-concat')
const fileChecksum = require('gulp-file-checksum')

const checksumTemplate = `{sha512}
`

exports.default = () =>
  src('../lib/packages/recompose/**/*.js')
    .pipe(
      concat(
        // bogus name - should be ignored by gulp-file-checksum:
        '.',
        { newline: '' }
      )
    )
    .pipe(
      fileChecksum({
        template: checksumTemplate,
        output: 'checksum',
      })
    )
    .pipe(dest('..'))
