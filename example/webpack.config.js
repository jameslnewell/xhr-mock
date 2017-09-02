const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve('src'),

  entry: {
    native: './native/index.js',
    axios: './axios/index.js',
    jquery: './native/index.js',
    superagent: './superagent/index.js'
  },

  output: {
    path: path.resolve('dist'),
    filename: '[name]/index.js'
  },

  plugins: [new CopyWebpackPlugin([{from: '**/*.html'}])]
};
