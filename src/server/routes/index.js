var express = require('express');
var router = express.Router();
var pg = require('pg');
var knex = require('../../../db/knex');
function Questions () {
  return knex('questions');
};

router.get('/', function(req, res, next) {
  Questions().select().then(function(data) {
    res.render('index', { title: 'Voting App', questions: data });
  });
});

router.get('/questions/:id', function(req, res, next) {
  Questions().where('questions.id', req.params.id).rightOuterJoin('answers', function() {
    this.on('questions.id', '=', 'answers.question_id');
  }).then(function(data) {
    res.render('answers', { answers: data });
  });
});

router.post('/answers/:id', function(req, res, next) {
  knex('answers').where('id', req.params.id).increment('vote_num', 1).then(function() {
    knex('answers').select('question_id').where('id', req.params.id).then(function(data) {
      console.log(data[0].question_id)
      res.redirect('/results/'+data[0].question_id);
    });
  });
});

router.get('/results/:id', function(req, res, next) {
  console.log(req.params.id);
  knex('answers').where('question_id', req.params.id).then(function(data) {
    res.render('results', { answers: data });
  });
});

router.get('/admin/questions/add', function(req, res, next) {
  Questions().select().then(function(data) {
    res.render('addQuestion', {title: 'Add or Edit Question', questions: data});
  });
});

router.post('/admin/questions/add', function(req, res, next) {
  Questions().insert({
    question: req.body.question,
    active: true
  }, 'id').then(function(id) {
    res.redirect('/admin/questions/'+id[0]+'/answers/add');
  });
});

router.get('/admin/questions/:id/answers/add', function(req, res, next) {
  Questions().where('id', req.params.id).then(function(data) {
    res.render('addAnswers', {title: 'Add Answers', question: data[0]})
  });
});

router.post('/admin/questions/:id/answers/add', function(req, res, next) {
console.log('bodddyyyyy', req.body);
  knex('answers').insert({
    answer: req.body.answer1,
    question_id: req.params.id
  }).then(function() {
      res.redirect('/');
    });
  });
});

router.get('/admin/questions/:id/edit', function(req, res, next) {
  Questions().rightOuterJoin('answers', function() {
    this.on('questions.id', '=', 'answers.question_id');
  }).where('questions.id', req.params.id).then(function(data) {
    console.log(data);
    res.render('edit', {questions: data, question_id: data[0].question_id});
  });
})

router.post('/admin/questions/:id/edit', function(req, res, next) {
  var keys = Object.keys(req.body);

  var promises = keys.map(function(key) {
    return knex('answers').update({
      answer: req.body[key]
    }).where('id', key);
  });

  Promise.all(promises).then(function() {
    res.redirect('/');
  });

});

module.exports = router;
