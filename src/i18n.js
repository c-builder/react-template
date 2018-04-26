import i18n from 'i18next/lib';
import resBundle from 'i18next-resource-store-loader?include=\\.json$!../src/locales/index.js';
import utils from './utils/utils';

if(typeof window != "undefined"){
  let backendOpts = {
    loadPath: './src/locales/{{lng}}/{{ns}}.json',
    addPath: './src/locales/{{lng}}/{{ns}}.missing.json',
    jsonIndent: 2
  };

  var i18nOpts = {
    lng: utils.getLang(),
    resources: resBundle,
    ns:['common'],
    preload: ['zh_CN','en_US'],
    defaultNS: 'common',
    debug:false,
    backend:backendOpts,
    interpolation: {
      escapeValue:false
    }
  };
  i18n.init(i18nOpts);
  if(module.hot){
    module.hot.accept("i18next-resource-store-loader!../src/locales/index.js",()=>{
      const res = require("i18next-resource-store-loader!../src/locales/index.js");
      Object.keys(res).forEach((lang)=>{
        Object.keys(res[lang]).forEach((namespace)=>{
          i18next.addResourceBundle(lang, namespace, res[lang][namespace] ,true ,true);
        });
      });
      i18next.emit("loaded");
    });
  }
}

export default i18n;
