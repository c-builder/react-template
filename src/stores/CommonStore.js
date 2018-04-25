import alt from '../alt';
import CommonAction from '../actions/CommonAction';

class CommonStore{
  constructor(){
    this.bindActions(CommonAction);
  }
  onGetAllTool(data){
    this.alltoolList = data;
  }
}

export default alt.createStore(CommonStore,'CommonStore')
