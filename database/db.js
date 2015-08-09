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
			var typeOfLogin = user.provider + "_users";
			var collection = db.collection(typeOfLogin);
			/* create user */
			/*insert user into collection*/
			console.log(user.id);
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

function getUserByName(username, callback) {
	/* connection to database */
	MongoClient.connect(url, function(err, db) {
		/* Error */
		var user;
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var collection = db.collection('local_users');
			/* find user by username*/
			collection.find({
				name: username
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
function getUserCharts(user, callback) {
	MongoClient.connect(url, function(err, db) {
		/* Error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var typeOfLogin = user.provider + "_users";
			var collection = db.collection(typeOfLogin);
			/* find user by username*/
			collection.find({
				name: user.name
			}).toArray(function(err, result) {
				/* user is found */

				console.log("Is user finded? : " + result.length);
				var data = result.length ? result[0] : undefined;
				console.log("data" + data);
				if(data) {
						console.log("User: " + data.name + " " + data.charts);
					callback(err, data.charts);
				}
				db.close();
			});
		}
	});
}
function deleteChart(user, id) {
	MongoClient.connect(url, function(err, db) {
		/* Error */
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		} else {
			/* get or create users collection */
			var typeOfLogin = user.provider + "_users";
			var collection = db.collection(typeOfLogin);
			/* find user by username*/
			collection.find({
				name: user.name
			}).toArray(function(err, result) {
				/* user is found */

				console.log("Is user finded? : " + result.length);
				var data = result.length ? result[0] : undefined;
				console.log("data" + data);
				if(data) {
					
					var charts = data.charts;
					console.log(charts);
					for(var i = 0; i < charts.length; ++i) {
						console.log("cI: "+ charts[i].id + " id: " + id);
						if(charts[i].id == id) {
							charts.splice(i,1);
							console.log(charts);
							break;
						}
					}
					collection.update({name: user.name}, {$set: {charts: charts}});
				}
				db.close();
			});
		}
	});
}
// db.collection('test').findAndModify(
// 							{name: user.name}, // query
// 							{
// 								$set: {
// 									charts: charts
// 								}
// 							}, // replacement, replaces only the field "hi"
// 							function(err, object) {
// 								if (err) {
// 									console.log(err.message); // returns error if no matching object found
// 								} else {
// 									console.log(object);
// 									db.close();
// 								}
// 							});
module.exports.insertUser = insertUser;
module.exports.saveChart = saveChart;
module.exports.getUserByName = getUserByName;
module.exports.getUserCharts = getUserCharts;
module.exports.deleteChart = deleteChart;