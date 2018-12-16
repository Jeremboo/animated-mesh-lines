const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackCommunConfig = require('./webpack.commun');

// CSS extract plugin and loader
webpackCommunConfig.plugins.push(
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: '[name].css',
    chunkFilename: '[id].css'
  })
);
// Inject into the css the extracter loader instead of the style-loader
webpackCommunConfig.module.rules[1].use[1] = MiniCssExtractPlugin.loader;

module.exports = Object.assign({
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    },
  },
}, webpackCommunConfig);