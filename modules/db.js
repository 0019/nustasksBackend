var MongoClient = require('mongodb').MongoClient;
var exports;

MongoClient.connect('mongodb://nustasksAdmin:bhmgdbnustasks@ds051334.mlab.com:51334/nustasks', function(err, database) {
	if (err) return console.log(err);
	exports.db = database;
});

module.exports = exports;
