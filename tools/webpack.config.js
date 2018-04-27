/**
 * webpack
 */
import path from 'path';
import webpack from 'webpack';
import extend from 'extend';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from "extract-text-webpack-plugin";
import fs from 'fs';
import webConfig from '../config/web.config.js';

const publicPath = (process.argv.includes('uat') || process.argv.includes('prod')) ? `${webConfig.staticPath}` : '/';

let tmpFolder = './tmp';
if (!fs.existsSync(tmpFolder)) {
  fs.mkdir(tmpFolder);
}

function createClitePage(route) {
  var str = `import renderRoute from '../src/utils/render';\nimport route from '../src/routes/${route}';\nrenderRoute(route);`
  fs.writeFileSync(`${tmpFolder}/${route}.js`, str, 'utf8');
}

let CLIENT_ENTRY = {};
fs.readdirSync('./src/routes').map((file) => {

  if (file != "index.js" && file.indexOf('svn') < 0) {
    createClitePage(file);
    CLIENT_ENTRY[file] = [`${tmpFolder}/${file}`];
  }
});

const DEBUG = !process.argv.includes('prod') && !process.argv.includes('uat');
const VERBOSE = process.argv.includes('verbose');
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 8',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : process.argv.includes('uat') ? '"uat"' : '"production"',
  __DEV__: DEBUG,
};

const commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
  minChunks: 8,
  name: "common"
});
const extractTextPlugin = new ExtractTextPlugin(DEBUG ? "css/[name].css?[hash]" : "css/[name].[chunkhash].css", {
  allChunks: true
});

const config = {
  output: {
    publicPath: publicPath,
    sourcePrefix: '',
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  resolve: {
    alias: {
      'i18n': path.resolve(__dirname, '../src/i18n')
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  },

  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      include: [
        path.resolve(__dirname, '../tmp'),
        path.resolve(__dirname, '../src'),
      ],
      loader: `babel-loader`
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.txt$/,
      loader: 'raw-loader',
    }, {
      test: /\.(png|jpg|jpeg|gif|ico|cur)$/,
      loader: DEBUG ? 'file-loader' : 'url-loader?name=images/[name].[ext]&limit=1000'
    }, {
      test: /\.(svg|woff|woff2|eot|ttf)$/,
      loader: DEBUG ? 'file-loader' : 'url-loader?name=fonts/[name].[ext]&limit=1000'
    }, {
      test: /\.(wav|mp3)$/,
      loader: 'file-loader',
    }]
  },

  postcss: function plugins(bundler) {
    return [
      require('postcss-import')({
        addDependencyTo: bundler
      }),
      require('postcss-cssnext')(),
      require('precss')(),
    ];
  },
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig = extend(true, {}, config, {
  entry: CLIENT_ENTRY,
  output: {
    path: path.join(__dirname, '../build/public'),
    filename: DEBUG ? 'js/[name].js?[hash]' : 'js/[name].[chunkhash].js',
  },

  plugins: [
    commonsPlugin,
    extractTextPlugin,
    new webpack.DefinePlugin({...GLOBALS, 'process.env.BROWSER': true }),
    new AssetsPlugin({
      path: path.join(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`,
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE,
        },
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ] : []),
  ],
  module: {
    loaders: [
      ...config.module.loaders,
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css")
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css!less")
      }
    ]
  },
  externals: {

  },
  node: {
    "fs": "empty"
  }
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = extend(true, {}, config, {
  entry: './src/server.js',
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^\.\/assets$/,
    function filter(context, request, cb) {
      const isExternal =
        request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/i18n/);
      cb(null, Boolean(isExternal));
    },
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: false
    }),
  ],
  module: {
    loaders: [
      ...config.module.loaders, {
        test: /\.css$/,
        loader: 'css-loader!postcss-loader',
      }, {
        test: /\.less$/,
        loader: 'css!less',
      }
    ],
  }
});

export default [clientConfig, serverConfig];
