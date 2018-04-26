import React from 'react';
import i18n from "../../i18n";
import HomePage from './HomePage';
import CONSTANTS from '../../constants';


export default {
  path: `${CONSTANTS.ROUTE_HOME}`,
  async action({next,render,context,params}){
    context.setTitle(i18n.t('common:website'));
    context.setCss("home");
    context.setJs("home");
    return <HomePage />;
  }
};
