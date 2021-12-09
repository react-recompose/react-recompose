module.exports = {
  plugins: [['@babel/proposal-class-properties', { loose: true }]],
  presets: [['@babel/env', { loose: true }], '@babel/react'],
}

// if (process.env.NODE_ENV === 'cjs') {
//   module.exports.plugins.push(... ...)
// }

// As of Jest 27, this seems to be needed regardless of process.env.NODE_ENV
// TODO: look for documentation *why* this is needed
module.exports.plugins.push('@babel/transform-runtime')
