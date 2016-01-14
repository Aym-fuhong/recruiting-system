'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var LogicPuzzleActions = require('../actions/logic-puzzle-actions');
var $ = global.jQuery = require('jquery');
require('bootstrap');


var LogicPuzzleAnswerSubmit = React.createClass({

  submitAnswer: function () {
    var answer = this.props.userAnswer;
    if (answer !== null && answer !== '') {
      var newOrderId = this.props.orderId < this.props.itemsCount -1 ?
                       this.props.orderId + 1:
                       this.props.orderId;
      LogicPuzzleActions.submitAnswer( newOrderId );
    } else {
      $('#warningModal').modal('show');
    }
  },

  handleAnswerChange: function(evt) {
    var val = evt.target.value;
    this.props.onAnswerChange(val);
  },


  render: function () {
    return (
        <div>
          <div className="answer-submit">
            <div className="row">
              <div className="col-md-4 col-sm-4 col-xs-4 result-text">
                <label htmlFor="result">结果为:</label>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-4">
                <input type="number" className="form-control" id="result" ref="answer"
                       disabled={this.props.isExample ? 'disabled' : ''}
                       value={this.props.userAnswer} onChange={this.handleAnswerChange}/>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-4">
                <button type="text" className="btn btn-danger"
                        disabled={this.props.isExample ? 'disabled' : ''}
                        onClick={this.submitAnswer}>提交</button>
              </div>
            </div>
          </div>

          <div className="modal fade bs-example-modal-sm" id="warningModal" tabIndex="-1" role="dialog" ref="warning">
            <div className="modal-dialog modal-sm" role="document" aria-hidden="true">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                      aria-hidden="true">&times;</span></button>
                  <h3 className="modal-title" id="waringModalLabel">注意!</h3>
                </div>
                <div className="modal-body">
                  <b>提交答案不能为空!</b>

                  <div className="modal-footer">
                    <a className="btn btn-default" data-dismiss="modal">关闭</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }


});

module.exports = LogicPuzzleAnswerSubmit;
