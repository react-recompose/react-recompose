module.exports = {
  plugins: [['@babel/proposal-class-properties', { loose: true }]],
  presets: [['@babel/env', { loose: true }], '@babel/react'],
}

if (process.env.NODE_ENV === 'cjs' || process.env.NODE_ENV === 'test') {
  module.exports.plugins.push('@babel/transform-runtime')
}
