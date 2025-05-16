const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        REACT_APP_API_URL: JSON.stringify('http://localhost:5000/api')
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public/assets',
          to: 'assets'
        }
      ]
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3001,
    hot: true,
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    },
    proxy: [{
      context: ['/api'],
      target: 'http://localhost:5000'
    }]
  }
}; 