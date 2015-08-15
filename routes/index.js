var express = require('express');
var passport = require("passport");
var passportLocal = require("passport-local");
var router = express.Router();
var encrypt = require('../secure/encrypt');
var db = require('../database/db');
var https = require('https');
router.get('/', function(req, res, next) {
	res.render('index', {
		isAuthenticated: req.isAuthenticated(),
		user: req.user
	});
});
router.get('/fac', function(req, res) {
	var FB = require('fb');

	var body = 'My first post using facebook-node-sdk';
	FB.api('me/feed', 'post', {
		message: body
	}, function(res) {
		if (!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}
		console.log('Post Id: ' + res.id);
	});
});
// var accessToken = ''; 
// // function postToFacebook(str, cb) {
// //   var req = https.request({
// //     host: 'graph.facebook.com',
// //     path: '/me/feed',
// //     method: 'POST'
// //   }, function(res) {
// //   	console.log('message='+encodeURIComponent(str)
// //     +'&access_token='+encodeURIComponent('CAACESdBRI10BAN8h9ep0GoQP3hwgBdCmycXZBWXiUMikEZBeMnQ5BCtXNgg8pW4Mts1zwzEJVFF7vjO6KMr9Oh04rH7FhLfKSanRPTB6Enus3Jo0eiN8sk0ZCxwTPl4iR6oQ465JVERz4RMZAq03tLlX1S9cSeLHVaHzhVWBbbIKZBgZBlzHkWFeDqKSiFw6h6HcHZBDof4WQZDZD'));
// //     res.setEncoding('utf8');
// //     res.on('data', function(chunk) {
// //       console.log('got chunk '+chunk);
// //     });
// //     res.on('end', function() {
// //       console.log('response end with status '+ res.status);
// //     });
// //   });
// //   console.log("                                            Acess Token                      :" + accessToken);
// //   req.end('message='+encodeURIComponent(str)
// //     +'&access_token='+encodeURIComponent('CAACESdBRI10BAJp8PC4QPYPvTL87c3Mm3UUKGixj2H04MUFuG8JkNw2mVGNPsTnxAcIZADUc6cnFMxxWwVsSWIz4ZBtYp9dPN6MiQYuVTZC7dquNes7kuUrjEwDzBPAYCgnEVSi4ZC96usfshrvv5pZAtAcFEPRBANhyZAzNOPMRGZALWEQ0Cv64Cnx4YhLUb4jez6xZBhqu3QZDZD'));
// //   console.log('message='+encodeURIComponent(str)
// //     +'&access_token='+encodeURIComponent('CAACESdBRI10BAN8h9ep0GoQP3hwgBdCmycXZBWXiUMikEZBeMnQ5BCtXNgg8pW4Mts1zwzEJVFF7vjO6KMr9Oh04rH7FhLfKSanRPTB6Enus3Jo0eiN8sk0ZCxwTPl4iR6oQ465JVERz4RMZAq03tLlX1S9cSeLHVaHzhVWBbbIKZBgZBlzHkWFeDqKSiFw6h6HcHZBDof4WQZDZD'));
// // };


// var FACEBOOK_APP_ID = "145452562457437";
// var FACEBOOK_APP_SECRET = "5e46e22927a26aa5d529975afed0be43";

router.get('/login', function(req, res, next) {
	/* Entered login or password is incorrect */
	var message = req.query.valid ? "Incorrect password or email" : null;
	res.render('login', {
		errorInfo: message
	});
	// console.log("ACS" + req.user.accessTokens);
	var FB = require('fb');

	FB.api('oauth/access_token', {
		client_id: '145452562457437',
		client_secret: '5e46e22927a26aa5d529975afed0be43',
		grant_type: 'client_credentials'
	}, function(res) {
		if (!res || res.error) {
			console.log(!res ? 'error occurred' : res.error);
			return;
		}

		var accessToken = res.access_token;

		console.log("TESTT:"+accessToken);
		FB.setAccessToken('access_token');

		var body = 'My first post using facebook-node-sdk';
		FB.api('me/feed', 'post', {
			message: body
		}, function(res) {
			console.log("TESTT:"+res);
			if (!res || res.error) {
				console.log(!res ? 'error occurred' : res.error);
				return;
			}
			console.log('Post Id: ' + res.id);
		});
	});
	//
	// accessToken = req.user.accessTokens;
	// postToFacebook('test from my personal server');
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
	function(req, res) {
		// The request will be redirected to Facebook for authentication, so this
		// function will not be called.
	});

router.get('/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect('/');
	});

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
	passport.authenticate('twitter', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		res.redirect('/');
	});

router.get('/user', ensureAuthenticated, function(req, res) {
	var user = req.user;
	res.render('user', {
		user: user
	});
});

router.post('/save', function(req, res) {

	if (req.isAuthenticated()) {
		var user = req.user;
		var chart = req.body;
		console.log("chart data" + chart);
		var elem = {
			url: chart.url,
			owner: user.id,
			name: chart.name,
			description: chart.description,
			data: chart.data
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
	req.on("data", function(data) {
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
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;