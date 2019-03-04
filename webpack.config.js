const path = require('path');
const webpack = require('webpack');
module.exports = {
 mode: 'development',
 entry: './client/index.js',
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js'
 },
 module: {
  rules: [{
   test: /.jsx?$/,
   loader: 'babel-loader',
   exclude: /node_modules/,
   query: {
    presets: ['@babel/preset-env', '@babel/preset-react']
   }
  }]
 }
}