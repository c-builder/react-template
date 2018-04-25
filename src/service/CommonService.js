/*
   提供本地服务并通过http请求第三方服务
   解决跨域、隐藏底层接口
 */

import webConfig from '../../config/web.config';
import Router from 'koa-router';
import path from 'path';
import serverHttp from '../core/Request';

const routePath = webConfig.routePath;
const route = new Router();

server.use(route.routes());

route.post(`${routePath}/savealltool`,function* (){
  let req = this.request;
  let result = yield serverHttp({
    url: `${webConfig.urls.saveAllTool}`,
    method: 'put',
    cookie: this.headers.cookie,
    data: req.body  //定义route.post()方式提供服务时，使用req.query来接收参数,注意：key应为data
  });
  try{
    this.body = JSON.parse(result);
  } catch(ex){
    this.body = result;
  }
});

route.get(`${routePath}/getuserlogin`,function* (){
  let req = this.request;
  let result = yield serverHttp({
    url: `${webConfig.urls.login}`,
    method: 'get',
    cookie: this.headers.cookie,
    params: req.query //定义route.get()方式提供服务时，使用req.query来接收参数,注意：key应为params
  });
  try{
    this.body = JSON.parse(result);
  } catch(ex){
    this.body = result;
  }
});
