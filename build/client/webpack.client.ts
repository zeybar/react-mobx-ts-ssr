import * as webpack from 'webpack'
import * as path from 'path'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as nodeExternals from 'webpack-node-externals'
import * as ForkTsCheckerNotifierWebpackPlugin from 'fork-ts-checker-notifier-webpack-plugin'
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { CheckerPlugin } from 'awesome-typescript-loader'

import configs from '../../configs'

const inRoot = path.resolve.bind(path, configs.pathBase)
const inRootSrc = (file) => inRoot(configs.pathBase, file)

const __DEV__ = process.env.NODE_ENV === 'development'
const __PROD__ = process.env.NODE_ENV === 'production'

const config = {
  name: 'client',
  target: 'web',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  },
  devtool: __DEV__ ? 'source-map' : false,
  entry: {
    main: [
      inRootSrc('src/Render.tsx')
      // 'E:/shinezone-generator-reactts/build/client/index.js'
      // 'babel-polyfill',
      // inRootSrc('src/Render.tsx') //run
      // inRootSrc('build/client/index.js')  //build
    ]
  },
  output: {
    filename: 'client.bundle.js',
    path: inRootSrc('dist'),
    publicPath: configs.compilerPublicPath
  },
  module: {
    loaders: [
    ],
    rules: [
    ]
  },
  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': { NODE_ENV: JSON.stringify(configs.env)},
      __DEV__,
      __PROD__,
    }))
  ]
}
config.plugins.push(
  new CheckerPlugin(),
  new ForkTsCheckerNotifierWebpackPlugin({
    excludeWarnings: true
  }),
  new ForkTsCheckerWebpackPlugin({
    checkSyntacticErrors: true
  })
)
// Development Tools
// ------------------------------------
if (__DEV__) {
  config.entry.main.push(
    `webpack-hot-middleware/client.js?path=/__webpack_hmr&timeout=1000&reload=true`
  )
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: inRootSrc('src/index.html'),
      hash: false,
      inject: true,
      manify: {
        collapseWhitespace: true
      }
    })
  )
}

if(__PROD__) {
  config.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      comments: false,    // remove all comments
      compress: {         // compress
        unused: true,
        dead_code: true,
        screw_ie8: true,
        warnings: false
      },
      sourceMap: false
    })
  )
}

config.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  query: {
    cacheDirectory: true,
    plugins: ['transform-runtime'],
    presets: ['env', 'react']
  }
})

config.module.rules.push({
  test: /\.ts|tsx?$/,
  enforce: 'pre',
  loader: 'awesome-typescript-loader?configFileName=tsconfig.json',
  exclude: /node_modules/
})

config.module.rules.push({
  test: /\.(scss|sass)$/,
  loader: ['style-loader', 'css-loader', 'sass-loader']
})

config.module.rules.push({
  test: /\.css$/,
  loader: ['style-loader', 'css-loader']
})




export default config