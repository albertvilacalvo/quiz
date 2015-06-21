var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};

// GET /quizes o /quizes?search=Italia
exports.index = function(req, res) {
  if (req.query.search) {
    var search = '%' + req.query.search.split(' ').join('%') + '%';
    // console.log(search);
    models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
      res.render('quizes/index', {quizes : quizes});
    }).catch(function(error) { next(error); });
  } else {
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index', {quizes : quizes});
    }).catch(function(error) { next(error); });
  }
};

// GET /quizzes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz : req.quiz});
};

// GET /quizzes/:id/answer?respuesta=Roma
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz : req.quiz, respuesta : resultado});
};
