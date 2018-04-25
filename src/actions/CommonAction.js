import alt from '../alt';
import axios from 'axios';
import webConfig from '../../config/web.config';


const basePath = `${webConfig.routePath}`;
class CommonAction {
  constructor(){
    this.generateActions(
      'onGetAllTool'
    );
  }

  //get请求无参数
  getAllTool(){
    axios({
      method: 'get',
      url: `${basePath}/alltoole?t=${Math.random()}`
    }).then((data)=>{
      this.dispatch(data); //使用store时用到
    }).catch(function(error){
      console.log(error);
    });
  }

  //post请求有参数
  savAllTool(params,callback){
    axios({
      method: 'post',
      data: params,
      url: `${basePath}/savAllTool?t=${Math.random()}`
    }).then((data)=>{
      //this.dispatch(data); //使用store时用到,可选
      if(callback && typeof callback === 'function'){
        callback(data.data);
      }
    }).catch(function(error){
      console.log(error);
    });
  }

  //get请求有参数
  savSubscribe(params,callback){
    axios({
      method: 'get',
      params: params,
      url: `${basePath}/savSubscribe?t=${Math.random()}`
    }).then((data)=>{
      //this.dispatch(data); //使用store时用到,可选
      if(callback && typeof callback === 'function'){
        callback(data.data);
      }
    }).catch(function(error){
      console.log(error);
    });
  }
}

export default alt.createActions(CommonAction);
