var express = require('express');
var router = express.Router();

var authMiddleware = require('../config/auth');

/* GET home page. */
router.get('/', authMiddleware, function(req, res, next) {
  console.log("User: ", req.user);
  res.render('index', { title: "Game Trade", user: req.user});
});

router.get('/login', function(req, res, next) {
  // res.render('login');
  res.render('form', {state: 'login', title: "Login"});
});

router.get('/register', function(req, res, next) {
  // res.render('register');
  res.render('form', {state: 'register', title: "Register"});
});

router.get('/secret', authMiddleware, function(req, res, next) {
  console.log('req.user:', req.user);
  res.send('Wooo!  Secret stuff!!!');
});

module.exports = router;
