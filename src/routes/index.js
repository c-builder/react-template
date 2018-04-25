import React from 'react';
import App from '../components/App';

let childrenRoute = [];
const reqRoutes = require.context("../routes",true,/index.js$/);
reqRoutes.keys().forEach(function(key){
  if(key != "./index.js"){
    if(reqRoutes(key).length) {
      reqRoutes(key).map((v)=>{
        childrenRoute.push(v);
      });
    }else{
      childrenRoute.push(reqRoutes(key));
    }
  }
});

export default {
  path: '/',
  children: childrenRoute,
  async action({next, render, context}) {
    const component = await next();
    if(component === undefined) return component;
    return render(
      <App context={context}>{component}</App>
    );
  }
};
