import React, {Component} from 'react';
import PropTypes from 'prop-types';
import emptyFunction from '../../utils/emptyFunction';
import './App.css';

class App extends Component {
  static propTypes = {
    context: PropTypes.shape({
      setTitle: PropTypes.func,
      setMeta: PropTypes.func,
      setJs: PropTypes.func,
      setCss: PropTypes.func,
      getUserInfo: PropTypes.func
    }),
    // children: PropTypes.element.isRequired,
    error: PropTypes.object
  };

  static childContextTypes = {
    setTitle: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    setJs: PropTypes.func.isRequired,
    setCss: PropTypes.func.isRequired,
    getUserInfo: PropTypes.func.isRequired
  };

  getChildContext() {
    const context = this.props.context;
    return {
      setTitle: context.onSetTitle || emptyFunction,
      setMeta: context.onSetMeta || emptyFunction,
      setJs: context.onSetJs || emptyFunction,
      setCss: context.onSetCss || emptyFunction,
      getUserInfo: context.getUserInfo || emptyFunction
    };
  }
  render(){
    return !this.props.error ? (
      <div>{this.props.children}</div>
    ) : this.props.children;
  }
}
export default App;
