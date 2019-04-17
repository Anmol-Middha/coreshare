const path = require('path');
const webpack = require('webpack');
module.exports = {
 mode: 'development',
 entry: './client/',
 output: {
  path: path.join(__dirname, 'client'),
  filename: 'bundle.js',
},
 module: {
  rules: [{
   test: /.jsx?$/,
   loader: 'babel-loader',
   exclude: /node_modules/,
   query: {
    presets: ['@babel/preset-env', '@babel/preset-react']
   }
  },
  {
    test: /\.(png|jp(e*)g|svg)$/,  
    use: [{
        loader: 'url-loader',
        options: { 
            limit: 8000, // Convert images < 8kb to base64 strings
            name: '/images/[hash]-[name].[ext]'
        } 
    }]
  }]
 },
}