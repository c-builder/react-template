if(process.env.NODE_ENV == 'production') {
  var domain = 'http://dev.cbuilder.com';
  var login = '';
  var loginOut = '';
  var cookieDomain = '.dev.cbuilder.com';
  var cookieLang = 'dev_cbuilder_lang';
  var staticPath = '';
  var routePath = '';
  var _apiPort = 80;
  var prefix = {
    mini : 'http://dev.cbuilder.com'
  };
}else if(process.env.NODE_ENV == 'uat'){
  var domain = '';
  var login = '';
  var loginOut = '';
  var cookieDomain = '';
  var cookieLang = '';
  var staticPath = '';
  var routePath = '';
  var _apiPort = 80;
  var prefix = {
    mini: ''
  };
}else{
  var domain = 'http://dev.cbuilder.com';
  var login = '';
  var loginOut = '';
  var cookieDomain = '.dev.cbuilder.com';
  var cookieLang = 'dev_cbuilder_lang';
  var staticPath = '';
  var routePath = '';
  var _apiPort = 80;
  var prefix = {
    mini : 'http://dev.cbuilder.com'
  };
}

module.exports = {
  domain: domain,
  loginHost : login,
  loginOut : loginOut,
  cookieDomain: cookieDomain,
  cookieLang: cookieLang,
  staticPath: staticPath,
  routePath: routePath,
  apiPort: _apiPort,
  urls: {
    getNavList: prefix.mini + '/news/get'
  }
};
