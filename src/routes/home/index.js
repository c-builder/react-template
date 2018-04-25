import React from 'react';
import HomePage from './HomePage';
import CONSTANTS from '../../constants';


export default {
  path: `${CONSTANTS.ROUTE_HOME}`,
  async action({next,render,context,params}){
    context.setTitle("dddd");
    context.setCss("home");
    context.setJs("home");
    return <HomePage />;
  }
};
