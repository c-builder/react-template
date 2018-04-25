import http from 'http';
import querystring from 'querystring';
import BufferHelper from 'bufferhelper';
import webConfig from '../../config/web.config';

async function reqService(opts){
  var postData = typeof opts.data === 'string' ? opts.data : querystring.stringify(opts.data);

  function encode(val){
    return encodeURIComponent(val).
      replace(/%40/gi,'@').
      replace(/%3A/gi,':').
      replace(/%24/gi,'$').
      replace(/%2C/gi,',').
      replace(/%20/gi,'+').
      replace(/%5B/gi,'[').
      replace(/%5D/gi,']');
  };

  var _url = opts.url;
  var _potocal = _url.split('//')[0];
  var _t  = _url.split('//')[1];
  var _host = _t.split('/')[0].replace(_potocal,'');
  var _path = _t.replace(_host,'');
  var _cookies = opts.cookie;
  var _port = opts.port || webConfig.apiPort || 80;
  var _headers = opts.headers;

  var headers = {};
  var _method = opts.method || 'get';
  var contentType = opts.contentType || 'application/x-www-form-urlencoded';
  if(_method == 'get'){
    var obj = opts.params;
    if(obj){
      if(typeof obj['t'] != 'undefined'){
        delete obj['t'];
      }
      var _str = '';
      var len = Object.keys(obj).length;
      if(len > 0){
        Object.keys(obj).map(function(item,index){
          if(index == 0){
            _str += "?";
          }
          _str += (item + "=" + encode(obj[item]) + (len - 1 == index ? '' : '&'));
        });
        _path = _path + _str;
      }
    }
  }


  if(_method.toLowerCase() != 'get'){
    headers = {
      'User-Agent': opts.userAgent || null,
      'Content-Type': contentType,
      'Content-Length': Buffer.byteLength(postData)
    };
  }

  if(_cookies){
    headers.cookie = _cookies;
  }

  if(_headers){
    headers = _headers;
  }

  var options = {
    host: _host,
    port: _port,
    path: _path,
    agent: false,
    method: _method,
    headers: headers
  };

  var data = await requestData(options,postData);
  return data;
}

function requestData(options,postData){
  return new Promise(function(resolve,reject){
    //console.time('==>' + options.path);
    var req = http.request(options,function(res){
      // if(res.statusCode === 421 || res.statusCode === 401){
      //   resolve({'statusCode': res.statusCode, 'statusMsg': res.statusMessage});
      // }

      if(res.statusCode >= 500){
        resolve({'statusCode': res.statusCode, 'statusMsg': res.statusMessage});
      }
      var bufferHelper = new BufferHelper();
      res.on('data',function(chunk){
        bufferHelper.concat(chunk);
      }).on('end', function(){
        var body = bufferHelper.toBuffer().toString();
        resolve(body);
        //console.timeEnd('==>'+ options.path);
      });
    });
    postData && req.write(postData);

    req.on('error',function(err){
      console.log(err,"=======error=======");
    });

    req.end();
  });
}

export default  reqService;
