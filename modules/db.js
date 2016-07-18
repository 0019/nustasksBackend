//var MongoClient = require('mongodb').MongoClient;
var app = require('../app');
var exports;

function connect() {
	MongoClient.connect('mongodb://nustasksAdmin:bhmgdbnustasks@ds051334.mlab.com:51334/nustasks', function(err, database) {
		if (err) return console.log(err);
		db = database;
	});
}

exports.doesUserExist = function(userid) {
	console.log(app.locals);
	var result = app.locals.db.collection('users').find().toArray(function(err, results) {
		console.log(result);
		return result? true : false;
	});
};

module.exports = exports;
