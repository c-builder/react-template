import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants';
import i18n from 'i18n';
import webConfig from '../../../config/web.config';
import utils from '../../utils/utils';
import './index.scss';

export default class Header extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }
  componentDidMount(){

  }
  render() {
    return (
      <div className="header">
        <div className="header-block cb">
          <a href="" className="logo">c-builder</a>
          <span className="lang-btn" onClick={utils.changeLang}>{i18n.t('common:lang')}</span>
        </div>
      </div>
    );
  }
}
