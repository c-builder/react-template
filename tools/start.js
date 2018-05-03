import Browsersync from 'browser-sync';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-middleware';
import run from './run';
import runServer from './runServer';
import webpackConfig from './webpack.config';
import clean from './clean';
import copy from './copy';
import webConfig from '../config/web.config';

async function start(){
  await run(clean);
  await run(copy.bind(undefined,{watch:true}));
  await new Promise(resolve =>{
    webpackConfig.filter(x => x.target !== 'node').forEach(config=>{
      if(Array.isArray(config.entry)){
        !process.argv.includes('nohot') && config.entry.unshift('webpack-hot-middleware/client');
      }else{
        for(var key in config.entry){
          !process.argv.includes('nohot') && config.entry[key].unshift('webpack-hot-middleware/client');
        }
      }

      config.plugins.push(new webpack.HotModuleReplacementPlugin());
      config.plugins.push(new webpack.NoErrorsPlugin());
      !process.argv.includes('nohot') &&
      config.module.loaders
        .filter(x => x.loader === 'babel-loader')
        .forEach(x => x.query = {
          plugins: ['react-transform'],
          extra: {
            'react-transform':{
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                }
              ]
            }
          }
        });
    });

    const bundler = webpack(webpackConfig);
    const wpMiddleware = webpackMiddleware(bundler, {

      publicPath: webpackConfig[0].output.publicPath,

      stats: webpackConfig[0].stats,

    });

    let webpackHotMiddleware = null;
    if(!process.argv.includes('nohot')){
      webpackHotMiddleware = require('webpack-hot-middleware');
    }
    let hotMiddlewares = process.argv.includes('nohot') ? [] : bundler.compilers
      .filter(compiler => compiler.options.target !== 'node')
      .map(compiler => webpackHotMiddleware(compiler));

      let handleServerBundleComplete = () => {
        runServer((err, host) => {
          if (!err) {
            const bs = Browsersync.create();
            let _host = webConfig.domain.replace("http://","").replace("https://","");
            bs.init({
              port: 4001,
              open: _host === "" ? "local" :"external",
              host: _host,
              proxy: {
                target: host,
                middleware: [wpMiddleware, ...hotMiddlewares],
              },
              files: ['build/public/**/*.*'],
            }, resolve);
            handleServerBundleComplete = runServer;
          }
        });
      };
      bundler.plugin('done', () => handleServerBundleComplete());
  });
}

export default start;
