import webpack from 'webpack';
import SpritesmithPlugin from 'webpack-spritesmith';
import path from 'path';

webpack({
  plugins: [new SpritesmithPlugin({
      // 源小图片
      src: {
        cwd: path.resolve(__dirname, '../src/components/App/images/icons'),
        glob: '*.png'
      },
      // 输出雪碧图文件及样式文件
      target: {
        image: path.resolve(__dirname, '../src/components/App/images/icon-sprite.png'),
        css: path.resolve(__dirname, '../src/components/App/icons.css')
      },
      apiOptions: {
        cssImageRef: './images/icon-sprite.png'  //设置样式文件内的雪碧图名称和路径
      },
      spritesmithOptions: {
        algorithm: 'top-down'  //雪碧图的布置方向
      }
    })]
}).run(function(err, stats) {
  if(err){
    console.log(err,'=======sprite errir========');
  }else {
    console.log('sprite done');
  }
});
