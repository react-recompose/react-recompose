const { src, dest } = require('gulp')
const concat = require('gulp-concat')
const fileChecksum = require('gulp-file-checksum')
const { series } = require('bach')

const checksumTemplate = `{sha512}
`

const checksumStage = () =>
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

exports.default = series(
  done => {
    console.log('starting')
    done()
  },
  checksumStage,
  done => {
    console.log('done')
    done()
  }
)
