'use strict';

var Reflux = require('reflux');
var ChangePasswordActions = require('../../actions/user-center/change-password-actions');
var request = require('superagent');
var page = require('page');
var errorHandler = require('../../../../tools/error-handler');
var constant = require('../../../../mixin/constant');
var lang = require('../../../../mixin/lang-message/chinese');

var ChangePasswordStore = Reflux.createStore({
  listenables: [ChangePasswordActions],

  onChangePassword: function (passwordInfo) {
    this.trigger({isRespond: true});

    request.put('/user-detail/change-password')
        .set('Content-Type', 'application/json')
        .send({
          data: passwordInfo
        })
        .use(errorHandler)
        .end((err, res) => {
          if(!res){
            return;
          }
          if (res.body.status === constant.httpCode.OK) {
            this.trigger({
              success: true,
              isRespond: false,
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          } else if (res.body.status === constant.httpCode.BAD_REQUEST) {
            this.trigger({
              isRespond: true,
              oldPasswordError: lang.ERROR
            });
          }
        });
  }
});

module.exports = ChangePasswordStore;
