const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const webpackCommunConfig = require('./webpack.commun');


// HACK
// Inject into the css the extracter loader instead of the style-loader
webpackCommunConfig.module.rules[1].use[0] = MiniCssExtractPlugin.loader;

// MERGE
module.exports = merge(webpackCommunConfig, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([webpackCommunConfig.output.path], { root: path.resolve(__dirname, '..'), verbose: true }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: 'vendors.css',
    }),
  ],
  optimization: {
    nodeEnv: 'production',
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      // include all types of chunks (JS, CCS, ...)
      chunks: 'all',
      name: 'vendors',
    },
  },
});