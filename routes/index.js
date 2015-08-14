var express = require('express');
var passport = require("passport");
var passportLocal = require("passport-local");
var router = express.Router();
var encrypt = require('../secure/encrypt');
var db = require('../database/db');

router.get('/', function(req, res, next) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});
router.get('/fac', function(req, res) {
	var FB = require('fb');

	var body = 'My first post using facebook-node-sdk';
	FB.api('me/feed', 'post', { message: body}, function (res) {
  		if(!res || res.error) {
  	  console.log(!res ? 'error occurred' : res.error);
   	 return;
  	}
  	console.log('Post Id: ' + res.id);
	});
});

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
			provider: "local",
			passport: encrypt.encrypt(req.body.password),
			charts: []
		};
	db.insertUser(user);
	res.redirect('/user');
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

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/user', ensureAuthenticated, function(req, res) {
  var user = req.user;
  res.render('user', {user: user});
});

router.post('/save', function(req, res) {	
	
	if(req.isAuthenticated()) {
		var user = req.user;
		var chart = req.body;
		console.log("chart data" + chart);
		var elem = {
			url: chart.url,
			owner: user.id,
			name: chart.name,
			description: chart.description,
			data:  chart.data
		} 
		db.savePublicChart(elem);
	} else {
		console.log("Please login");
	}
	res.send(req.body);
});

router.get('/data', ensureAuthenticated, function(req, res) {
	var user = req.user;
	console.log("BE user:" + user.name);
	db.getUserCharts(user, function(err, result) {
		console.log("REs" + result);
		res.send(result);
	});
});

router.post('/share', function(req, res) {
	if (req.isAuthenticated()) {
		var chart = req.body;
		db.savePublicChart(chart);
	} else {
		console.log("Please login");
	}
	res.send(chart);
});

router.delete('/charts/:id', function(req, res) {
	req.on("data", function (data) {
        console.log('delete me')
    });
    console.log(req.params.id);
    db.deleteChart(req.params.id);
    res.end("JSON accepted by server");
});

router.get('/public/:id', function(req, res) {
	console.log("here");
	db.getChartByUrl(req.params.id, function(err, chartData) {
		res.send(chartData);
	});
	console.log("here");
});

router.get('/:id', function(req, res) {
    var url = req.params.id;
    db.getChartByUrl(url, function(err, result) {
    	res.render('view', {
			data: JSON.stringify(result.data)
		});	
    });
    
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = router;