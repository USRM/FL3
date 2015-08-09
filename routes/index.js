var express = require('express');
var passport = require("passport");
var passportLocal = require("passport-local");
var router = express.Router();
var encrypt = require('../secure/encrypt');
var db = require('../database/db');
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	/* Entered login or password is incorrect */
	var message = req.query.valid ? "Incorrect password or email" : null;
	res.render('login', {
		errorInfo: message
	});
});
/* POST user data. */
router.post('/login', function(req, res, next) {
	/* Passport function */
	passport.authenticate('local', function(err, user, info) {
		/* Error */
		if (err) {
			return next(err);
		}
		/* Incorrect login or password */
		if (!user) {
			var string = encodeURIComponent('something that would break');
			return res.redirect('/login?valid=' + string);
		}
		/* Correct login and password */
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/user');
		});
	})(req, res, next);
});
/* Logout and redirect to home page */
router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
/* Registration */
router.get('/registration', function(req, res) {
	res.render('registration');
});
/* Registrate new user */
router.post('/registration', function(req, res) {
	var user = {
			id: req.body.email,
			name: req.body.name,
			email: req.body.email,
			passport: encrypt.encrypt(req.body.password),
			provider: "local",
			charts: []
		};
	db.insertUser(user);
	res.redirect('/');
});
router.post('/save', function(req, res) {
	
	console.log(req.isAuthenticated());

	if (req.isAuthenticated()) {
		console.log(req.user.id);
		var user = req.user;
		var chart = req.body;
		db.saveChart(user, chart);
	} else {
		console.log("Please login");
	}
	res.send(req.body);
});
router.get('/editor', function(req, res) {
	res.render('editor');
});
router.get('/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });
router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
router.get('/user', ensureAuthenticated, function(req, res) {
  var user = req.user;
  res.render('user', {user: user});
});
router.get('/data', ensureAuthenticated, function(req, res) {
	var user = req.user;
	console.log("BE user:" + user.name);
	db.getUserCharts(user, function(err, result) {
		var json = {charts: result};
		res.send(json);
	});
});
router.delete('/charts/:id', function(req, res) {
	req.on("data", function (data) {
        console.log('delete me')
    });
    console.log(req.params.id);
    db.deleteChart(req.user, req.params.id);
    res.end("JSON accepted by server");
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;