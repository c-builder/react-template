import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants';
import i18n from 'i18n';
import Header from '../../components/Header';
import webConfig from '../../../config/web.config';
import './HomePage.css';

export default class HomePage extends Component {
  constructor(props){
    super(props);

    this.state = {

    };
  }
  componentDidMount(){

  }
  render() {
    return (
      <div>
        <Header />
        <div className="main-block">
          <div className="main">
            <p className="h1">{i18n.t('common:simpleTitle')}</p>
            <ul>
              <li>{i18n.t('common:list1')}</li>
              <li>{i18n.t('common:list2')}</li>
              <li>{i18n.t('common:list8')}</li>
              <li>{i18n.t('common:list3')}</li>
              <li>{i18n.t('common:list4')}</li>
              <li>{i18n.t('common:list5')}</li>
              <li>LESS、PostCss</li>
              <li>webpack</li>
              <li>{i18n.t('common:list6')}</li>
              <li>{i18n.t('common:list7')}</li>
            </ul>

            <div className="download"><a href="https://github.com/c-builder/react-template" target="_blank" title="git" className="soure-code">{i18n.t('common:sourceCode')}</a></div>
          </div>
        </div>
      </div>
    );
  }
}
