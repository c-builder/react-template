/*
生成雪碧图
 */


var sprity = require('sprity');
sprity.create({
  src: './src/componnents/App/images/icons/**/**/*.png',
  out: './src/componnents/App/images/',
  cssPath: './images/',
  style: '../icons.css',
  name: 'icon-sprite',
  margin: 0,
  split: true
},function(err){
  if(err){
    console.log(err,'=======sprite errir========');
  }else {
    console.log('done');
  }
});
