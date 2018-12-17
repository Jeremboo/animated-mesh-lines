const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const poststylus = require('poststylus');


// Paths
const distPath = path.resolve(__dirname, '../dist');
const nodeModulesPath = path.resolve(__dirname, './node_modules');
const demosPath = path.resolve(__dirname, '../app/demos');

// Init props
const entries = {};
const plugins = [
  new webpack.LoaderOptionsPlugin({
    debug: true,
    options: {
      stylus: {
        use: [poststylus(['autoprefixer'])],
      },
    },
  }),
];

// * Dynamic entry points for each demos
const dirs = fs.readdirSync(demosPath);
dirs.forEach(dir => {
  // Set each entry for each demo
  entries[dir] = `${demosPath}/${dir}/index.js`;

  // Add an html webpack plugin for each entry
  plugins.push(new HtmlWebpackPlugin({
    // inject: false,
    chunks: [dir, 'vendors'],
    filename: `${distPath}/${dir}.html`,
    template: `${demosPath}/${dir}/index.html`,
  }));
});

// * WEBPACK CONFIG
module.exports = {
  // node: {
  //   fs: 'empty'
  // },
  mode: 'development',
  entry: entries,
  output: {
    filename: '[name].js',
    path: distPath,
    // publicPath: myLocalIp,
    // publicPath: '/',
  },
  resolve: {
    alias: {
      App: path.resolve(__dirname, '../app/app.js'),
      utils: path.resolve(__dirname, '../app/utils'),
      objects: path.resolve(__dirname, '../app/objects'),
      decorators: path.resolve(__dirname, '../app/decorators'),
    },
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: nodeModulesPath,
    },
    {
      test: /\.(styl|css)$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            // sourceMap: true
          },
        },
        {
          loader: 'css-loader',
          options: {
            // sourceMap: true
          },
        },
        {
          loader: 'stylus-loader',
          options: {
            // sourceMap: true
          },
        },
      ],
    },
    // {
    //   test: /\.(png|jpe?g|gif)$/,
    //   loader: 'file-loader?name=imgs/[hash].[ext]',
    // },
    // {
    //   test: /\.(eot|svg|ttf|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    //   loader: 'file-loader?name=fonts/[name].[ext]',
    // },
    {
      test: /\.(glsl|frag|vert)$/,
      exclude: nodeModulesPath,
      loader: 'raw-loader'
    },
    {
      test: /\.(glsl|frag|vert)$/,
      exclude: nodeModulesPath,
      loader: 'glslify-loader'
    }],
  },
  plugins: plugins,
};