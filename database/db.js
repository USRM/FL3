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
		console.log("USER ::::  " + user);
		var typeOfLogin = user.provider + "_users";
		var collection = db.collection(typeOfLogin);
		collection.update({
			id: user.id
		}, {
			$push: {
				"charts": chart
			}
		}, function(err, doc) {
			console.log(doc);
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

module.exports.insertUser = insertUser;
module.exports.saveChart = saveChart;
module.exports.getUserByName = getUserByName;
