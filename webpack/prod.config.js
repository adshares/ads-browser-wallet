const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    adswallet: [customPath, path.join(__dirname, '../chrome/extension/adswallet')],
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')]
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['react-optimize']
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer]
          }
        }
      ]
    },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
    {
      test: /\.(ttf|eot|woff|woff2|jpe?g|png|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    },
      // "file" loader makes sure assets end up in the build folder.
      // When you import an asset, you get its filename.
      // This loader doesn't use a "test" so it will catch all modules
      // that fall through the other loaders.
    {
      loader: 'file-loader',
        // Exclude js files to keep "css" loader working as it injects
        // it's runtime that would otherwise processed through "file" loader.
        // Also exclude html and json extensions so they get processed
        // by webpacks internal loaders.
      exclude: [/\.js$/, /\.html$/, /\.json$/],
      options: {
        name: '[name].[ext]',
      },
    },
      // * STOP * Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ]
  },
  node: {
    fs: 'empty'
  }
};
