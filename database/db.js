var mongodb = require('mongodb');
var url = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/Users';
var MongoClient = mongodb.MongoClient;

function insertUser(user) {
	/* connection to database */
	MongoClient.connect(url, function(err, db) {
		/* error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			console.log('Connection established to', url);
			/* get or create collection of users*/
			var collection = db.collection("users");
			/* create user */
			/*insert user into collection*/
			collection.find({
				id: user.id
			}).toArray(function(err, result) {
				/* user is found */
				console.log("length:", result.length);
				if (!result.length) {
					collection.insert(user, function(err, result) {
						if (err) {
							console.log(err);
						} else {
							console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
							db.close();
						}
					});
				}
			});
		}

	});
}

function savePublicChart(chart) {
	MongoClient.connect(url, function(err, db) {
		var collection = db.collection("charts");
		collection.update({
			url: chart.url
		}, 
			{
				name: chart.name,
				description: chart.description,
				data: chart.data,
				'public': chart.public,
				url: chart.url,
				id: chart.url,
				owner: chart.owner
			}
		, {
			'upsert': true
		});
		/*collection.insert(chart, function(err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log('Inserted documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
				db.close();
			}
		});*/
	});
}

function saveChart(user, chart) {
	MongoClient.connect(url, function(err, db) {
		var typeOfLogin = user.provider + "_users";
		var collection = db.collection(typeOfLogin);
		collection.update({
			id: user.id
		}, {
			$push: {
				"charts": chart
			}
		}, function(err, doc) {
			db.close();
		});

	});
}

function checkСorrectness(username, callback) {
	/* connection to database */
	MongoClient.connect(url, function(err, db) {
		/* Error */
		var user;
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var collection = db.collection('users');
			/* find user by username*/
			collection.find({
				id: username
			}).toArray(function(err, result) {
				/* user is found */
				console.log(result.length);
				user = result.length ? result[0] : undefined;
				callback(err, user);
				db.close();
			});
		}
	});
}

function getUserCharts(id, callback) {
	MongoClient.connect(url, function(err, db) {
		/* Error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var collection = db.collection("charts");
			/* find user by username*/
			collection.find({
				owner: id
			}).toArray(function(err, result) {
				/* user is found */
				console.log(result.length);
				var charts = [];
				for (var i = 0; i < result.length; ++i) {
					console.log(result[i]);
					charts.push(result[i]);
				}
				console.log("charts"+charts);
				callback(err, charts);
				// }
				db.close();
			});
		}
	});
}

function getChartByUrl(chartUrl, callback) {
	MongoClient.connect(url, function(err, db) {
		/* Error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var collection = db.collection("charts");
			/* find user by username*/
			collection.find({
				url: chartUrl
			}).toArray(function(err, result) {
				/* user is found */
				console.log("Is user finded? : " + result.length);
				var chart = result.length ? result[0] : undefined;
				console.log("chart  :" + chart);
				if (chart) {
					callback(err, chart);
				}
				db.close();
			});
		}
	});
}

function deleteChart(id) {
	MongoClient.connect(url, function(err, db) {
		/* Error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var collection = db.collection("charts");
			collection.remove({
				url: id
			}, function(err, result) {
				if (err) {
					console.log(err);
				}
				console.log(result);
				db.close();
			});
		}
	});
}
module.exports.insertUser = insertUser;
module.exports.saveChart = saveChart;
module.exports.checkСorrectness = checkСorrectness;
module.exports.getUserCharts = getUserCharts;
module.exports.deleteChart = deleteChart;
module.exports.savePublicChart = savePublicChart;
module.exports.getChartByUrl = getChartByUrl;