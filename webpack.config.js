// Emily wrote this config based on other projects. most people copy and paste from other places. No long strings with exclamation points.
// there are lots of webpack configs out there; copy one to be the skeleton for your project
// yeoman: is another scaffolder. one of the biggest problems with webpack is there's so much scaffolding to work with.
const path = require('path')
const merge = require('webpack-merge')
const validate = require('webpack-validator')

const parts = require('./libs/parts')

const TARGET = process.env.npm_lifecycle_event
const ENABLE_POLLING = process.env.ENABLE_POLLING
// PATHS is where we define paths for where to pull from
const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'app', 'manifest.scss')
  ],
  build: path.join(__dirname, 'build'),
  test: path.join(__dirname, 'tests')
}

process.env.BABEL_ENV = TARGET

const common = merge(
  {
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it is
    // convenient with more complex configurations.
    entry: {
      app: PATHS.app
    },
    output: {
      path: PATHS.build,
      filename: '[name].js'
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  },
  parts.indexTemplate({
    title: 'Code 501 React Boilerplate',
    appMountId: 'app'
  }),
  parts.loadJSX(PATHS.app),
  parts.lintJSX(PATHS.app)
)

let config

// Detect how npm is run and branch based on that

// for each case, we're creating a variable called config, and using a webpack thing to merge; programmatically calling different functions to do things. eg. parts.clean(PATHS.build), which means clean out the build folder. This is run top to bottom.
// this is really weird way of doing things. webpack 2.0 which is in the works, with better configuration and better docs.
// basically scaffold a project from old ones' webpack configs.
switch (TARGET) {
  case 'build':
  case 'stats':
    config = merge(
      common,
      {
        devtool: 'source-map',
        entry: {
          style: PATHS.style
        },
        output: {
          // TODO: Set publicPath to match your GitHub project name
          // (e.g. '/my-awesome-app/'). Webpack will alter asset paths
          // based on this. You can even use an absolute path here or
          // even point to a CDN.
          // publicPath: ''
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react', 'react-dom']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style)
    )
    break
  case 'test':
  case 'test:tdd':
    config = merge(
      common,
      {
        devtool: 'inline-source-map'
      },
      parts.loadIsparta(PATHS.app),
      parts.loadJSX(PATHS.test)
    )
    break
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
        entry: {
          style: PATHS.style
        }
      },
      parts.setupCSS(PATHS.style),
      parts.devServer({
        // Cusomize host/port here if needed
        host: process.env.HOST,
        port: process.env.PORT,
        poll: ENABLE_POLLING
      }),
      parts.enableReactPerformanceTools(),
      parts.npmInstall()
    )
}

module.exports = validate(config, {
  quiet: true
})
