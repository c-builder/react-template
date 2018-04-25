if(process.env.NODE_ENV == 'production') {
  var domain = '';
  var login = '';
  var loginOut = '';
  var cookieDomain = '';
  var cookieLang = '';
  var staticPath = '';
  var routePath = '';
  var _apiPort = 80;
  var prefix = {
    hi: ''
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
    hi: ''
  };
}else{
  var domain = 'http://dev.cwx508489.com:4005';
  var login = '';
  var loginOut = '';
  var cookieDomain = '.cwx508489.com';
  var cookieLang = 'dev_lang';
  var staticPath = '';
  var routePath = '';
  var _apiPort = 80;
  var prefix = {
    hi: 'http://dev.cwx508489.com'
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
    getNavList: prefix.hi + '/hi/group/nav'
  }
};
