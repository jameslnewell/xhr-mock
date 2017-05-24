const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve('src'),

  entry: {
    native: './native/index.test.js',
    axios: './axios/index.test.js',
    jquery: './native/index.test.js',
    superagent: './superagent/index.test.js'
  },

  output: {
    path: path.resolve('dist'),
    filename: '[name]/index.test.js'
  },

  plugins: [new CopyWebpackPlugin([{from: '**/*.html'}])]
};
