'use strict';

var Reflux = require('reflux');
var HomeworkActions = require('../../actions/homework/homework-actions');
var superAgent = require('superagent');
var constant = require('../../../../mixin/constant');


var HomeworkSidebarStore = Reflux.createStore({
  listenables: [HomeworkActions],

  onLoadHomeworkList: function () {
    superAgent.get('/homework/get-list')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          if (err || res.status !== constant.httpCode.OK) {
            return;
          }
          this.trigger({homeworkStatusList:res.body.homeworkQuizzes});
        });
  },
  
  onChangeOrderId: function (clickNumber) {
    this.trigger({clickNumber: clickNumber});
  },

  onSubmited: function (orderId) {
    this.trigger({waitingNumber: orderId});
  }
});

module.exports = HomeworkSidebarStore;
