import 'babel-core/polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import koa from 'koa';
import bodyParser from 'koa-body';
import session from 'koa-generic-session';
import {resolve} from 'universal-router/universal-router';
import changeLang from './middleware/ChangeLang';
import routes from './routes';
import config from './config';
import webConfig from '../config/web.config';
import Html from './components/Html';
import assets from './assets';
import Constants from './constants';

const {port} = config;
const server = global.server = koa();

server.use(require('koa-static')(path.join(__dirname,'public')));

server.use(bodyParser());

server.keys =['ISON_SESSION_CAT'];

server.use(session({
  ttl: 24* 3600 * 1000,
  key: 'ISON_sid'
}));



const reqServices = require.context('./service',true, /^(.*\.(js$))[^.]*$/igm);
reqServices.keys().forEach(function(key){
  reqServices(key);
});

server.use(changeLang());

server.use(function* (next){
  try {
    let req = this.request;
    let lang = req.lang;

    let user_info = {};

    if(process.env.NODE_ENV == 'development'){
      let Revison = require('./core/Revison');
      let revisonData = yield Revison();
      Object.assign(assets, revisonData);
    }

    let statusCode = 200;
    let data = {
      title: '',
      description: '',
      body: '',
      commonJs: assets.common ? assets.common.js : null,
      vendorJs : assets.vendor ? assets.vendor.js : null,
      commonCss: assets.common ? assets.common.css : null,
      vendorCss: assets.vendor ? assets.vendor.css : null,
      jsEntry: null,
      cssEntry: null,
      assets: assets
    };

    const css = [];
    const context = {
      headers: this.headers,
      setJs: value => {
        let jsArry = value.split(',');
        let j = [];
        jsArry.map(function(v){
          assets[v] && assets[v].js && j.push(assets[v].js);
        });
        data.jsEntry = j;
      },
      setCss: value => {
        let cssArry = value.split(',');
        let s = [];
        cssArry.map(function(v){
          assets[v] && assets[v].css && s.push(assets[v].css);
        });
        data.cssEntry = s;
      },
      setTitle: value => data.title = value,
      setMeta: (key, value) => data[key] = value,
      onGetUserInfo: ()=> user_info
    };

    let body = null;
    yield resolve(routes, {
      path: req.path,
      query: req.query,
      context,
      render(component,status = 200){
        statusCode = status;
        data.userInfo = user_info;
        data.path = req.path;
        data.body = ReactDOM.renderToString(component);
        return true;
      }
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    statusCode == 200 && req.path.indexOf('__webpack_hmr') < 0;
    body = `<!DOCTYPE html>${html}`;
    this.type = 'text/html;charset=utf-8';
    this.status = statusCode;
    body = body.replace('[$userInfo]', JSON.stringify(user_info));
    this.body = body;
  } catch(e){
    this.body = e + '';
    yield next;
  }
});

server.listen(port, function(){
  console.log(`The server is running at http://localhost:${port}/`);
});
