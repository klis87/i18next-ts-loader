const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  context: __dirname,
  entry: './src/index',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.i18n$/,
        exclude: /node_modules/,
        loader: 'i18next-ts-loader',
        options: {
          basePath: 'src/',
          addContentHash: true,
          localeFilesPattern: '/locales/{{lng}}/{{ns}}.json',
        },
      },
    ],
  },
  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: __dirname,
    },
    port: 3000,
    hot: true,
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'src', 'index.html'),
    }),
  ],
};
