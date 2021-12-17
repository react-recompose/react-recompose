module.exports = {
  plugins: [['@babel/proposal-class-properties', { loose: true }]],
  presets: [['@babel/env', { loose: true }], '@babel/react'],
}

// TODO: find link to explain *why* @babel/transform-runtime is needed here
if (process.env.NODE_ENV === 'cjs' || process.env.NODE_ENV === 'test') {
  module.exports.plugins.push('@babel/transform-runtime')
}
