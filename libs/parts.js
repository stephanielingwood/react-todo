const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// this separates some things out of the webpack config file. the below plugin automatically downloads and installs npm packages when one is imported.
const NpmInstallPlugin = require('npm-install-webpack-plugin')

exports.indexTemplate = function (options) {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: require('html-webpack-template'),
        title: options.title,
        appMountId: options.appMountId,
        inject: false
      })
    ]
  }
}

// in parts, we define little bits of code, how it gets loaded, etc. loaders are bits of software that take in files, do things to them, and spit out something else. babel is the transpiler, that takes es6 and spits out es5.
// this file gets written in es5, to preserve compatibilty with node
exports.loadJSX = function (include) {
  return {
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          // Enable caching for extra performance
          loaders: ['babel?cacheDirectory'],
          include: include
        }
      ]
    }
  }
}

// a test runner
exports.loadIsparta = function (include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['isparta'],
          include: include
        }
      ]
    }
  }
}

// go look in webpack.config.js to see when these are called. this one is called from common, so it's run whenever anything else is run.
exports.lintJSX = function (include) {
  return {
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loaders: ['standard'],
          include: include
        }
      ]
    }
  }
}

exports.enableReactPerformanceTools = function () {
  return {
    module: {
      loaders: [
        {
          test: require.resolve('react'),
          loader: 'expose?React'
        }
      ]
    }
  }
}

exports.devServer = function (options) {
  const ret = {
    devServer: {
      // Enable history API fallback so HTML5 History API-based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set HotModuleReplacementPlugin!
      //hot true reloads whenever you have changes
      hot: true,
      inline: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }

  if (options.poll) {
    ret.watchOptions = {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 1000
    }
  }

  return ret
}

// loads css and sass
exports.setupCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.(scss|scss)$/,
          loaders: ['style', 'css', 'sass'],
          include: paths
        }
      ]
    }
  }
}

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
}

exports.setFreeVariable = function (key, value) {
  const env = {}
  env[key] = JSON.stringify(value)
  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
}

exports.extractBundle = function (options) {
  const entry = {}
  entry[options.name] = options.entries
  return {
    // Define an entry point needed for splitting
    entry: entry,
    plugins: [
      // Extract bundle and manifest files.
      // Manifest is needed for reliable caching.
      new webpack.optimize.CommonsChunkPlugin({
        names: [options.name, 'manifest'],
        // options.name modules only
        minChunks: Infinity
      })
    ]
  }
}

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}

exports.extractCSS = function (paths) {
  return {
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: paths
        }
      ]
    },
    plugins: [
      // Output extracted CSS to a file
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  }
}

exports.npmInstall = function (options) {
  options = options || {}
  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  }
}
