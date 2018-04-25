import React ,{Component} from 'react';
import PropTypes from 'prop-types';
import webConfig from '../../../config/web.config';

class Html extends Component{
  static propTypes = {
    title:PropTypes.string,
    description: PropTypes.string,
    body:PropTypes.string.isRequired
  };

  static defaultProps ={
    title:'',
    description:''
  };

  render(){
    let jsEntry = this.props.jsEntry;
    let cssEntry = this.props.cssEntry;
    return (
      <html className="no-js" lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="description" content={this.props.description} />
          <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
          <title>{this.props.title}</title>
          {
            this.props.vendorCss && <link rel="stylessheet" href={`${this.props.vendorCss}`} />
          }
          {
            this.props.commonCss && <link rel="stylessheet" href={`${this.props.commonCss}`} />
          }
          {
            typeof cssEntry != "undefined" && cssEntry && cssEntry.map((item,idx)=>{
              return <link key={idx} rel="stylessheet" href={`${item}`} />;
            })
          }
          <script dangerouslySetInnerHTML={{__html:`window['userInfo']=([$userInfo]);`}} />
        </head>
        <body>
          <div id="app" className="react-content" dangerouslySetInnerHTML={{__html:this.props.body}} />
          {
            this.props.vendorJs ? <script src={`${this.props.vendorJs}`}></script> : null
          }
          {
            this.props.commonJs ? <script src={`${this.props.commonJs}`}></script> : null
          }
          {
            typeof jsEntry != "undefined" && jsEntry && jsEntry.map((item,idx)=>{
              return <script key={idx} src={`${item}`}></script>;
            })
          }
        </body>
      </html>
    );
  }
}

export default Html;
