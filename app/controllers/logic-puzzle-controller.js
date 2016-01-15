'use strict';

var logicPuzzle = require('../models/logic-puzzle');
var constant = require('../mixin/constant');
var async = require('async');
var apiRequest = require('../services/api-request');

function LogicPuzzleController() {
}

LogicPuzzleController.prototype.getLogicPuzzle = function (req, res) {
  var orderId = req.query.orderId;
  var userId = req.session.user.id;

  logicPuzzle.getLogicPuzzle(orderId, userId)
      .then((data) => {
        res.send(data);
      });
};

LogicPuzzleController.prototype.saveAnswer = function (req, res) {
  var orderId = req.body.orderId;
  var userAnswer = req.body.userAnswer;
  var userId = req.session.user.id;
  async.waterfall([
    function (done) {
      logicPuzzle.findOne({userId: userId}, done);
    }, function (data, done) {

      if (orderId > data.quizExamples.length - 1) {
        data.quizItems[orderId - data.quizExamples.length].userAnswer = userAnswer;
        data.save((err, doc)=> {
          done(err, doc);
        });
      } else {
        done(null, 'doc');
      }
    }, function (doc, done) {
      done();
    }
  ], function (err) {
    if (!err) {
      res.sendStatus(constant.httpCode.OK);
    } else {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }
  });
};

LogicPuzzleController.prototype.submitPaper = function (req, res) {
  var examerId = req.session.user.id;
  var endTime = Date.parse(new Date()) / constant.time.MILLISECOND_PER_SECONDS;
  var data;
  async.waterfall([
    function (done) {
      logicPuzzle.findOne({userId: examerId}, done);
    },(doc,done) => {
      data = doc;
      LogicPuzzleController.setScoreSheet(data, done);
    },
    function (responds, done) {
      data.endTime = endTime;
      data.isCommited = true;
      data.save((err, doc)=> {
        done(err, doc);
      });
    }
  ], function (err) {
    if (!err) {
      res.sendStatus(constant.httpCode.OK);
    }else {
      res.sendStatus(constant.httpCode.INTERNAL_SERVER_ERROR);
    }

  });

};

LogicPuzzleController.setScoreSheet = function (data, done){
  var scoreSheetUri = 'scoresheets';
  var itemPosts = [];
  data.quizItems.forEach(function (quizItem) {
    itemPosts.push({answer: quizItem.userAnswer, quizItemId: quizItem.id});
  });
  var body = {
    examerId: data.userId,
    paperId: data.paperId,
    blankQuizSubmits: [
      {
        blankQuizId: data.blankQuizId,
        itemPosts: itemPosts
      }
    ]
  };
  apiRequest.post(scoreSheetUri, body, done);
};

module.exports = LogicPuzzleController;