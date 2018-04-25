import React from 'react';
import ReactDOM from 'react-dom';
import {resolve} from 'universal-router/universal-router';
import App from '../components/App';
import history from '../core/History';
import {addEventListener , removeEventListener} from '../utils/utils';

export default function renderRoute(route){
  let childrenRoute = [];
  if(route.length){
    route.map((v)=>{
      childrenRoute.push(v);
    })
  }else{
    childrenRoute.push(route);
  }
  const routes = {
    path: '/',
    children: childrenRoute,
    async action({next,render,context}){
      const component = await next();
      if(component === undefined) return component;
      return render(
        <App context={context}>{component}</App>
      );
    }
  };

  const context = {
    setJs: value=>{},
    setCss: value=>{},
    setTitle: value=>document.title = value,
    setMeta: (name, content)=>{},
    getUserInfo: ()=>window['userInfo']
  };

  function render(container,state,component){
    return new Promise((resolve,reject)=>{
      try{
        ReactDOM.hydrate(
          component,
          container
        );
      }catch(err){
        reject(err);
      }
    });
  }

   function run(){
     let currentLocation = null;
     const container = document.getElementById('app');
     const removeHistoryListener = history.listen(location=>{
       currentLocation = location;
       resolve(routes,{
         path: location.pathname,
         query:location.query,
         state:location.state,
         context,
         render: render.bind(undefined,container,location.state),
       }).catch(err=>console.error(err));
     });

     addEventListener(window,'pagehide',()=>{
       removeHistoryListener();
     });
   }

   if((document.readyState == 'loaded') || document.readyState == 'complete' || document.readyState == 'interactive'){
     run();
   }else{
     document.addEventListener('DOMContentLoaded',run,false);
   }

}
