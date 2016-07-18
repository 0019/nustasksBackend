var exports;
var User = require('./user');

exports.refresh = function(req, res, next) {
	var userid = req.userid;
	var db = req.db;
	db.collection('users').find({'UserID': userid}, {'tasks': 1}).limit(1).toArray(function(err, result) {
		if (err) return console.log(err);
		if (result.length == 0) { // new user
			next();
		} else {
			res.send(result);
		}
	});
};

exports.addTask = function(req, res) {
	var contents = req.query.contents;
	var roll = req.query.syncroll;
	var title = req.query.title;
	var due = req.query.due;
	
	var entry = {'Title': title, 'Contents': contents, 'Due': due, 'Syncroll': roll, 'CreatedBy': req.userid};
	req.db.collection('tasks').save(entry, function(err, result) {
		res.redirect('/tasks/?token=' + req.token);
	});
};

module.exports = exports;
