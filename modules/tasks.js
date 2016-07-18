var exports;
var User = require('./user');
var DB = require('./db');

exports.refresh = function(req, res) {
	var userid = req.userid;
	DB.db.collection('users').find({'UserID': userid}, {'syncrolls': 1}).limit(1).then(function(data) {
		if (!data) res.send('Not existing.');
		res.send(id);
	});
};

module.exports = exports;
