const webpackCommunConfig = require('./webpack.commun');

module.exports = Object.assign({
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    },
  },
}, webpackCommunConfig);