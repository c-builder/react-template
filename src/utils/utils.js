import webConfig from '../../config/web.config';
import Cookie from './cookie';


function qs(flag) {
  let param = window.location.search.substr(1).split('&');
  if(flag === '') return {};
  var b = {};
  for(var i = 0; i < param.length; i++){
    var p = param[i].split('=',2);
    if(p.length === 1){
      b[p[0]] = '';
    }else{
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g,''));
    }
  }
  return b[flag];
}

function getLang(type){
  let lang = qs('l');
  let _lang = '';
  if(lang){
    Cookie.set(webConfig.cookieLang,lang,{expires:30,path:'/',domain:webConfig.cookieDomain});
  }else{
    lang = Cookie.get(webConfig.cookieLang) || 'zh-cn';
  }
  if(type && type === 'forUrl'){
    _lang = lang;
  }else{
    _lang = lang === 'en' ? 'en_US' : 'zh_CN';
  }
  return _lang;
}

function changeLang(){
  let lang = qs('l');
  let s = location.search ? '&' : '?';
  if(!lang){
    lang = Cookie.get(webConfig.cookieLang) || 'zh-cn';
  }
  let _lang = lang === 'en' ? 'zh-cn' : 'en';
  Cookie.set(webConfig.cookieLang, _lang, {expires: 30, path: '/', domain: webConfig.cookieDomain});

  if(qs('l')){
    let url = location.href.replace('l=' + lang,'l=' + _lang);
    if(_lang === 'en' && qs('lang') !== 'en'){
      url = url.replace('&lang=all','').replace('&lang=cn','');
    }
    if(_lang === 'zh-cn'){
      url = url.replace('&lang=cn','');
    }
    location.href = url;
  }else{
    location.href = `${location.href}${s}l=${_lang}`;
  }

}

function addEventListener(element,eventType,fun){
  if(top.window.attachEvent){
    element.attachEvent('on' + eventType, fun);
  }else{
    element.addEventListener(eventType,fun, false);
  }
}
function removeEventListener(){
  if(top.window.attachEvent){
    element.detachEvent('on' + eventType, fun);
  }else{
    element.removeEventListener(eventType,fun);
  }
}


module.exports = {
  qs,
  getLang,
  changeLang,
  addEventListener,
  removeEventListener
}
