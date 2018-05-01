const path = require('path');
const glob = require('glob');

module.exports = {
  devtool: 'eval',
  context: path.resolve('.'),
  entry: ['./src/_.ts', ...glob.sync('./src/**/*.test.ts')],
  output: {
    path: path.resolve('dist'),
    filename: 'tests.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{test: /\.tsx?$/, loader: 'ts-loader'}]
  }
};
