/*
  生成资源版本号

 */
import readdirp from 'readdirp';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

async function revison() {
  let url ='./public/js/libs'; //linux下路径用'/'
  if(process.env.NODE_ENV == "development"){
    //windows 路径用'\'
    url = path.resolve(__dirname,url);
    url = url.replace(/\//g,'\\');
  }
  let revisonData = await getVisionData(url);
  if(revisonData){
    let assets = {};
    revisonData.map(function(v){
      assets[v.name] = {
        "js": v.path + '?v=' + v.hash
      };
    });
    return assets;
  }
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
      filesObj.files.map(async function(file){
        let buf = await readFile(file.fullPath);
        let hash = crypto.createHash('md5').update(buf).digest('hex').slice(0,16);
        visionData.push({
          name: path.basename(file.fullPath,'.js'),
          path: `/js/libs/${file.path.replace(/\\/ig,"/")}`,
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
