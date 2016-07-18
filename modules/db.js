var MongoClient = require('mongodb').MongoClient;
var exports;

var db = function() {
	MongoClient.connect('mongodb://nustasksAdmin:bhmgdbnustasks@ds051334.mlab.com:51334/nustasks', function(err, database) {
		if (err) return console.log(err);
		return database;
	});
};

exports.db = db();

module.exports = exports;
