import readdirp from 'readdirp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import del from 'del';
import webConfig from '../config/web.config.js';

async function revison(){
  del(['build/images','build/fonts','build/*.eot','build/*.ttf','build/*.svg','build/*.woff'],{dot: true});

  let revisonData = await getVisionData('./build/public/js/libs');
  if(revisonData){
    let assets = {};
    revisonData.map(function(v){
      assets[v.name] = {
        'js': v.path + '?v=' + v.hash
      }
    });

    fs.readFile('./build/assets.js','utf8',function(err,data){
      let newData = data.replace('};',',');
      let assetsStr = JSON.stringify(assets);
      newData += assetsStr.substr(1, assetsStr.length - 1);
      fs.writeFile('./build/assets.js',newData,function(){});
    });
  }
}

async function getVisionData(_root,_filter){
  return new Promise(function(resolve,reject){
    readdirp({
      root: _root,
      fileFilter: _filter || ['*.js']
    }, async function(err, filesObj){
      if(!filesObj){
        resolve(null);
      }
      let staticPath = '/';
      if(process.env.NODE_ENV == 'uat' || process.env.NODE_ENV == 'production') {
        staticPath = `${webConfig.staticPath}`;
      }

      let hashData =  await getHashData(filesObj.files);
      resolve(filesObj.files.map((file, idx)=>{
        return {
          name: path.basename(file.fullPath,'js'),
          path: `${staticPath}js/libs/${file.path.replace(/\\/ig,"/")}`,
          hash: hashData[idx]
        }
      }));
    });
  });
}

async function getHashData(files){
  let _hash = [];
  for(let file of files){
    let rf = readFile(file.fullPath);
    let buf = await rf;
    let hash = crypto.createHash('md5').update(buf).digest('hex').slice(0,16);
    _hash.push(hash);
  }
  return _hash;
}

async function readFile(fullPath){
  return new Promise(function(resolve,reject){
    fs.readFile(fullPath, 'utf8', function(err,buf){
      if(err){
        reject(err);
      }else{
        resolve(buf);
      }
    });
  });
}

export default revison;
