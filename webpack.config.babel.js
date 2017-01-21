'use strict';
import Webpack from 'webpack';
import Merge from 'webpack-merge';
import Path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import PostCSS from './postcss.config';


// Detect if running environment is that of `production`:
const isProd = (process.env.NODE_ENV === 'production');
  console.log(`Node environment:\t${process.env.NODE_ENV}\t-\tisProd: ${isProd}`);

// Static vendor libraries:
const VENDOR_LIBS = [
  'body-parser',
  'jquery',
  'lodash',
  'react',
  'react-dom',
  'react-promise',
  'react-redux',
  'react-router',
  'react-router-redux',
  'redux',
  'redux-promise'
];

// Webpack configuration fields shared among `development` & `production` builds:
const BASE_CONFIG = {
  entry: {
    bundle: Path.resolve(__dirname, 'src/App'),
    vendor: VENDOR_LIBS
  },
  output: {
    path: Path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /(node_modules|bower_components)/,
        use: 'babel'
      }, {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css'
        })
      }, {
        test: /\.s(c|a)ss$/i,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: ['css', 'postcss', 'sass']
        })
      }, {
        test: /\.json$/i,
        use: 'json'
      }, {
        test: /\.(pdf|doc[mstx]?|ppt[mstx]?|od[fpst])$/i,
        use: 'file?name=/docs/[name].[ext]'
      }, {
        test: /\.(jpe?g|png|gif|bmp|svg|ttif)$/i,
        use: [
          {
            loader: 'url',
            options: { limit: 40000 }
          },
          'file?name=/images/[name].[ext]',
          'image-webpack'
        ]
      }, {
        test: /\.woff$/i,
        use: 'url?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]'
      }, {
        test: /\.woff2$/i,
        use: 'url?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]'
      }
    ]
  },
  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new Webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        postcss: { PostCSS }
      }
    }),
    new ExtractTextPlugin('styles.css'),
    new HTMLWebpackPlugin({
      template: 'assets/index.html'
    })
  ],
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  cache: true,
  watch: true,
  devtool: `${isProd ? 'inline' : 'cheap-eval'}-source-map`,
  resolve: {
    extensions: ['.js', '.jsx']
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  }
};

// Webpack configuration parameters unique to the `development` build:
const DEV_CONFIG = {
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    host: 'localhost',
    hot: true,
    inline: true,
    noInfo: false,
    port: 3000
  },
  stats: {
    assets: true,
    children: false,
    chunks: false,
    colors: {
      bold: '\u001b[1m',
      cyan: '\u001b[1m\u001b[36m',
      green: '\u001b[1m\u001b[32m',
      magenta: '\u001b[1m\u001b[35m',
      red: '\u001b[1m\u001b[31m',
      yellow: '\u001b[1m\u001b[33m'
    },
    errorDetails: true,
    hash: false,
    modules: false,
    publicPath: false,
    reasons: true,
    timings: true,
    version: false,
    warnings: true
  }
};

// Consummate Webpack configuration object:
const AGGREGATE_CONFIG = isProd
  ? BASE_CONFIG
  : Merge(BASE_CONFIG, DEV_CONFIG);

export default AGGREGATE_CONFIG;
