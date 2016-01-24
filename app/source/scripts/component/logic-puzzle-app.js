'use strict';

var React = require('react');
var Reflux = require('reflux');

var LogicPuzzleStore = require('../store/logic-puzzle-store');
var LogicPuzzleActions = require('../actions/logic-puzzle-actions');

var LogicPuzzleLeft = require('./logic-puzzle-left.component');
var LogicPuzzleSidebar = require('./logic-puzzle-sidebar.component');

var TimerStore = require('../store/timer-store');

var Modal = require('react-bootstrap/lib/Modal');
var Button = require('react-bootstrap/lib/Button');

var LogicPuzzle = React.createClass({
  mixins: [Reflux.connect(LogicPuzzleStore), Reflux.connect(TimerStore)],

  getInitialState: function () {
    return {
      item: {
        initializedBox: [],
        chartPath: '',
        description: []
      },
      showModal: false
    };
  },

  componentDidMount: function () {
    LogicPuzzleActions.loadItem();
  },

  handleAnswerChange: function (val) {
    LogicPuzzleActions.changeAnswer(val);
  },

  timeOver: function() {
    this.setState({
      showModal: true
    });
  },

  render: function () {

    return (

        <div className="container-fluid">
          <div className="row">
            {this.props.children[0]}
            {this.props.children[1]}
            <Modal
              show={this.state.showModal}
              dialogClassName="custom-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">提示:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                时间到,已提交.
              </Modal.Body>
              <Modal.Footer>
                <Button href="dashboard.html">确定</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
    );
  }
});

module.exports = LogicPuzzle;
