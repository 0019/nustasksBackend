var exports;
var User = require('./user');
var async = require('async');

exports.refresh = function(req, res, next) {
	var userid = req.userid;
	var db = req.db;
	db.collection('users').find({'UserID': userid}, {'syncrolls': 1}).limit(1).toArray(function(err, result) {
		if (err) return console.log(err);
		if (result.length == 0) { // new user
			next();
		} else {
			var tasksByRolls = [];
			var calls = [];
			result[0].syncrolls.forEach(function(roll) {
				calls.push(function(callback) {
					console.log(roll);
					db.collection('tasks').find({'Syncroll': roll}, {'Title': 1, 'Due': 1}).toArray(function(err, result) {
						tasksByRolls.push(result);
						console.log(roll + ' pushed');
						callback(null, roll);
					});
				});
			});
			async.parallel(calls, function(err, result) {
				res.send(tasksByRolls);
			});
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
		console.log('Task ' + title + ' added')
		res.redirect('/tasks/?token=' + req.query.token);
	});
};

exports.getTask = function(req, res) {
	req.db.collection('tasks').find({'_id': req.query.id}).limit(1).toArray(function(err, result) {
		res.send(result);
	});
};

exports.updateTask = function(req, res) {
	var contents = req.query.contents;
	var roll = req.query.syncroll;
	var title = req.query.title;
	var due = req.query.due;
	var id = req.query.id; // require task id
	
	req.db.collection('tasks').update({'_id': id}, {'Title': title, 'Contents': contents, 'Due': due, 'Syncroll': roll, 'UpdatedBy': req.userid}).toArray(function(err, result) {
		console.log('Task ' + title + ' added')
		res.redirect('/tasks/getTask/?id=' + id + 'token=' + req.query.token);
	});
};

module.exports = exports;
