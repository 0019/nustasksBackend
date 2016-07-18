var exports;
var request = require('request');
var apiKey = 'rSe7yZUlJVbjo95tnZs4i';

exports.syncIVLE = function(req, res) {
	var token = req.query.token;
	var userid = req.userid;
	var db = req.db;
	var modules = [];
	var modules_student = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + apiKey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false&output=json';
	request(modules_student, function(error, response, body) {
		var json = JSON.parse(body);
		for (var key in json['Results']) {
			var mod = json['Results'][key]['CourseCode'];
			//console.log(modules.indexOf(mod));
			if (modules.indexOf(mod) < 0) {
				modules.push(mod);
				var add = function(mod) { 
					db.collection('syncrolls').find({'CourseCode': mod}, {}).limit(1).toArray(function(err, result) {
						console.log(result);
						if (result.length == 0) {
							var entry = {'CourseCode': mod, 'CreatedBy': 'IVLE'};
							console.log(entry);
							db.collection('syncrolls').save(entry, function(err, result) {
								if (err) return console.log(err);
								console.log(mod + ' added to database');
							});
						}
					});
				};
				add(mod);
			}
		}
		//adding new user
		var newUser = {'UserID': userid, 
					   'syncrolls': modules};
		db.collection('users').save(newUser, function(err, result) {
			res.redirect('/tasks/?token=' + token);
		});
	});
};

module.exports = exports;
