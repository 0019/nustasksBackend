var DB = require('./db');
var User = require('./user');

var exports;

exports.syncIVLE = function(req, res) {
	res.send('syncIVLE');
};

exports.refresh = function(req, res) {
	DB.db.collection('users').findOne({'UserID': 'a0107360'}, {'syncrolls': 1}).then(function(rolls) {
		console.log(rolls);
		res.send(rolls);
	});
};

exports.getRoll = function(req, res) {
	console.log('Get roll');
	var roll = req.query.roll;
	DB.db.collection('syncrolls').findOne({'CourseCode': roll}).then(function(data) {
		res.send(data);
	});
};

exports.addRoll = function(req, res) {
	var roll = req.query.roll;
	var entry = {'CourseCode': roll, 'CreatedBy': User.userid};
	DB.db.collection('syncrolls').save(entry, function(err, result) {
		if (err) return console.log(err);
		console.log('Created new syncroll ' + roll);
	});
	//DB.db.collection('users').update({})
};

exports.deleteRoll = function(req, res) {
	var rollid = req.query.rollid;
	
};

module.exports = exports;
