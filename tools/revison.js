import readdirp from 'readdirp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import del from 'del';
import webConfig from '../config/web.config.js';

async function revison(){
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
      fs.writeFile('./build/assets.js',newData);
    });
  }

  setTimeout(()=>{
    del(['build/images','build/fonts','build/*.eot','build/*.ttf','build/*.svg','build/*.woff'],{dot: true})
  },2000);
}

async function getVisionData(_root,_filter){
  return new Promise(function(resolve,reject){
    var visionData = [];
    readdirp({
      root: _root,
      fileFilter: _filter || ['*.js']
    },function(err, filesObj){
      if(!filesObj){
        resolve(null);
      }
      let staticPath = '/';
      if(process.env.NODE_ENV == 'uat' || process.env.NODE_ENV == 'production') {
        staticPath = `${webConfig.staticPath}`;
      }
      filesObj.files.map(async function(file){
        let buf = await readFile(file.fullPath);
        let hash = crypto.createHash('md5').update(buf).digest('hex').slice(0,16);
        visionData.push({
          name: path.basename(file.fullPath,'js'),
          path: `${staticPath}js/libs/${file.path.replace(/\\/ig,"/")}`,
          hash: hash
        });
      });
      setTimeout(()=>{
        resolve(visionData);
      },500);
    });
  });
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
