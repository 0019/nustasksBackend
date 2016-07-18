var exports;
var User = require('./user');
var DB = require('./db');

exports.refresh = function(req, res) {
	var userid = req.userid;
	var db = req.db;
	db.collection('users').find({'UserID': userid}).limit(1).toArray(function(err, result) {
		if (err) return console.log(err);
		if (result.length == 0) { // new user
			//IVLE.newUser();
		} else {
			
		}
	});
};

module.exports = exports;
