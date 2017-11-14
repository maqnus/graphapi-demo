const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      }
    ]
  }
};
