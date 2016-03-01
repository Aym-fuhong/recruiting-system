'use strict';

var React = global.React = require('react');
var ReactDOM = require('react-dom');
var validate = require('validate.js');
var passwordRetrieveActions = require('../../actions/password-retrieve/password-retrieve-actions');
var passwordRetrieveStore = require('../../store/password-retrieve/password-retrieve-store');
var Reflux = require('reflux');
var constraint = require('../../../../mixin/password-retrieve-constraint');
var page = require('page');
var constant = require('../../../../mixin/constant');

function getError(validateInfo, field) {
  if (validateInfo && validateInfo[field] && validateInfo[field].length > 0) {
    return validateInfo[field][0];
  }
  return '';
}

var passwordRetrieveForm = React.createClass({
  mixins: [Reflux.connect(passwordRetrieveStore)],

  getInitialState: function () {
    return {
      showMessage: false,
      retrieveFailed: false,
      emailError: '',
      clickable: false,
      email: ''
    };
  },

  handleChange: function (event) {
    var value = event.target.value;
    var name = event.target.name;
    passwordRetrieveActions.changeValue(name, value);
  },

  validate: function (event) {
    var target = event.target;
    var value = target.value;
    var name = target.name;
    var valObj = {};
    var result;
    var error;
    var stateObj = {};
    valObj[name] = value;
    result = validate(valObj, constraint);
    error = getError(result, name);
    stateObj[name + 'Error'] = error;
    this.setState(stateObj);
  },

  retrieve: function () {
    if (!this.state.email || this.state.emailError) {

      var valObj = {};
      var stateObj = {};

      valObj.email = ReactDOM.findDOMNode(this.refs.email).value;
      stateObj.emailError = getError(validate(valObj, constraint), 'email');

      this.setState(stateObj);
    } else {

      this.setState({
        clickable: true
      });

      var email = ReactDOM.findDOMNode(this.refs.email).value;
      passwordRetrieveActions.retrieve(email);
    }
  },

  render: function () {

    var retrieveClassName = 'password-retrieve-form-container ' + (this.state.showMessage ? 'hide' : '');
    var messageClassName = 'message-container ' + (this.state.showMessage ? '' : 'hide');

    return (
        <div>
          <div id="retrieve" className={retrieveClassName}>
            <h4 className="welcome">密码找回</h4>
            <div className={'lose' + (this.state.retrieveFailed === false ? ' hide' : '')} name="retrieveFailed">
              该邮箱并不存在
            </div>
            <form action="">
              <div className="form-group">
                <input className="form-control" type="text" placeholder="请输入注册时填写的邮箱" name="email"
                       onBlur={this.validate}
                       ref="email" autoComplete="off" onChange={this.handleChange} value={this.state.email}/>
                <div
                    className={'lose' + (this.state.emailError === '' ? ' hide' : '')}>{this.state.emailError}
                </div>
              </div>
              <button type="button" id="retrieve-btn" className="btn btn-lg btn-block btn-primary col-md-offset-4"
                      onClick={this.retrieve}
                      disabled={this.state.clickable}>确认
                <i className={'fa fa-spinner fa-spin loading' + (this.state.clickable ? '' : ' hide')}/>
              </button>
            </form>
          </div>
          <div id="message" className={messageClassName}>
            <p>您的重置密码链接已经发送至邮箱<strong>{this.state.email}</strong>中,请注意查收!</p>
          </div>
        </div>
    );
  }
});

module.exports = passwordRetrieveForm;