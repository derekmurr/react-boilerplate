/* eslint-disable no-unused-vars */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// We'll refer to our source and dist paths frequently, so let's store them here
const PATH_SOURCE = path.join(__dirname, './src');
const PATH_DIST = path.join(__dirname, './dist');

// If we export a function, it will be passed two paramenters, the first of which is the webpack command line environment option `--env`. `webpack --env.production` sets env.production = true. `webpack --env.a = b` sets env.a = 'b'. See https://webpack.js.org/configuration/configuration-types#exporting-a-function
module.exports = (env) => {
  const { environment } = env;
  const isProduction = environment === 'production';
  const isDevelopment = environment === 'development';

  return {
    // Tell Webpack to do some optimizations for our environment (ie, development or production). Webpack will enable certain plugins and set `process.env.NODE_ENV` according to the environment we specify. See https://webpack.js.org/configuration/mode
    mode: 'development',

    // The point or points to enter the application. this is where Webpack will start. We generally have one entry point per HTML page. For single-page applications, this means one entry point. For traditional multi-page apps, we may have multiple entry points. See https://webpack.js.org/concepts#entry
    entry: [
      path.join(PATH_SOURCE, './index.js'),
    ],

    // Tell Webpack where to spit out the bundles it creates and how to name them.
    // See https://webpack.js.org/concepts#output and https://webpack.js.org/configuration/output#outputFilename
    // ./src/index.js is the entry point, and the compiled bundle gets emitted to ./dist,
    // where `name` is the entry name
    // name defaults to 'main' and `hash` is a unique hash, good for cache-busting
    output: {
      path: PATH_DIST,
      filename: 'js/[name].[hash].js',
    },

    // Determine how the different types of modules will be treated.
    // See https://webpack.js.org/configuration/module and https://webpack.js.org/concepts#loaders
    module: {
      rules: [
        {
          test: /\.js$/, // Apply this rule to files ending in .js
          exclude: /node_modules/, // Don't apply to files that live in the node_modules folder
          use: { // Use the following loader and options
            loader: 'babel-loader',
            // We can pass options to both babel-loader and Babel.
            // This option object will replace babel-config.js
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: true, // Output the targets/plugins used when babel runs
                  useBuiltIns: 'usage', // Configure how @babel/preset-env handles polyfills from core-js
                  corejs: 3, // Specify the core-js version. Must match the version in package.json

                  // Specify which environments we support/target.
                  // We're specifying them in .browserlistrc so it's not needed here
                  // targets: "",
                }],

                // The react preset includes several plugins that are required to write a React app.
                // For example it transforms JSX into React.createElement() calls
                '@babel/preset-react',
              ],
            },
          },
        },
      ],
    },

    plugins: [
      // This plugin generates an HTML5 file that imports our Webpack bundles using <script> tags.
      // The file will be placed in `output.path`. See: https://github.com/jantimon/html-webpack-plugin
      new HtmlWebpackPlugin({
        template: path.join(PATH_SOURCE, './index.html'),
      }),

      // This plugin will delete all files inside `output.path` but the directory itself is be kept.
      // See: https://github.com/johnagan/clean-webpack-plugin
      new CleanWebpackPlugin(),
    ],

    // Config options for Webpack DevServer, an Express web server that aids with development.
    // It provides live reloading out of the box and can be configured to do a lot more.
    devServer: {
      // The dev server will serve content from this directory
      contentBase: PATH_DIST,

      // Specify a host (defaults to 'localhost')
      host: 'localhost',

      // Specify a port number on which to listen for requests
      port: 8080,

      // When using the HTML5 History API (you'll probably do this with React later),
      // index.html should be served in place of 404 responses
      historyApiFallback: true,

      // Show a full-screen overlay in the browser when there are compiler errors or warnings
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  };
};
