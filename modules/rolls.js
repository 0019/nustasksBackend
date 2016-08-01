var async = require('async');
var exports;
/*
exports.syncIVLE = function(req, res) {
	res.send('syncIVLE');
};
*/
exports.refresh = function(req, res) {
	var db = req.db;
	db.collection('users').find({'UserID': req.userid}, {'syncrolls': 1}).limit(1).toArray(function(err, results) {
		console.log('Refresh rolls: ' + results);
		res.send(results);
	});
};

exports.getRoll = function(req, res) {
	var db = req.db;
	var calls = [];
	var ret = [];
	calls.push(function(callback) {
		db.collection('syncrolls').find({'_id': rollid}).limit(1).toArray(function(err, results) {
			ret.push(results);
			callback();
		});
	});
	calls.push(function(callback) {
		DB.db.collection('tasks').find({'Syncroll': rollid}, {'Title': 1, 'Due': 1}).toArray(function(err, results) {
			ret.push(results);
			res.send(ret);
			callback();
		});
	});
	async.series(calls);
};

exports.addRoll = function(req, res) {
	var title = req.query.title;
	var entry = {'CourseCode': roll, 'CreatedBy': req.userid};
	DB.db.collection('syncrolls').save(entry, function(err, result) {
		if (err) return console.log(err);
		console.log('Created new syncroll ' + roll);
	});
};

exports.deleteRoll = function(req, res) {
	var rollid = req.query.rollid;
	
};

module.exports = exports;
