import i18n from 'i18next';
import resBundle from 'i18next-resource-store-loader?include=\\.json$!../locales/index.js';
import webConfig from '../../config/web.config';

export default function changeLang(){
  return function* (next){
    let cookies = this.cookies;
    let req = this.request;
    let lang = req.query.lang || req.query.l;
    if(!lang){
      lang = cookies.get(webConfig.cookieLang) || 'zh-cn';
    }

    if(lang === 'en' || lang === 'en_US'){
      lang = 'en_US';
    }else{
      lang ='zh_CN';
    }
    req.lang = lang;

    if(i18n.language && i18n.language === lang){
      yield next;
      return;
    }

    let backendOpts = {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
      addPath: './src/locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2
    };

    let i18nOpts = {
      lng: lang,
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
    yield next;
  };
}
