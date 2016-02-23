'use strict';

var React = require('react');
var LoginActions = require('../actions/login-actions');
var LoginStore = require('../store/login-store');
var Reflux = require('reflux');

var LoginInfo = React.createClass({
  mixins: [Reflux.connect(LoginStore)],

  getInitialState: function (){
    return {
      isLoginState: false
    };
  },

  toggleState: function () {
    LoginActions.changeState(this.state.isLoginState);
  },

  render: function () {

    return (
        <div id="login-info" className="col-md-5 register-form-right">
          <div id="register-right" className="link">
            {this.state.isLoginState ? '还没账号?' : '已有账号?'}
            <a id="change-to-logon" href="#" onClick={this.toggleState}>
              {this.state.isLoginState ? '立即注册' : '立即登录'}
            </a>
          </div>
        </div>
    );
  }
});

module.exports = LoginInfo;


