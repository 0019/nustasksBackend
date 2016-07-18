var express = require('express');
var tasks = express.Router();

var Tasks = require('../modules/tasks');
var IVLE = require('../modules/ivle');
var User = require('../modules/user');

//var apiKey = 'rSe7yZUlJVbjo95tnZs4i';

/* Tasks page. */

/* Refresh the task list */
tasks.get('/', User.requireUserID, Tasks.refresh);

/* Synchronise with IVLE modules */
tasks.get('/syncIVLE', IVLE.syncIVLE);


/*
tasks.get('/refresh', function(req, res) {
	token = req.query.token;
	var modules_student = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + apiKey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false&output=json';
	var userID_get = 'https://ivle.nus.edu.sg/api/Lapi.svc/UserID_Get?APIKey=' + apiKey + '&Token=' + token;
	var modules = [];
	var userID;
	request(userID_get, function(error, response, body) {
		//var json = JSON.parse(body);
		userID = JSON.parse(body);
		//res.send(userID);
		request(modules_student, function(error, response, body) {
			var json = JSON.parse(body);
			for (var key in json['Results']) {
			var mod = json['Results'][key]['CourseCode'];
			console.log(modules.indexOf(mod));
			if (modules.indexOf(mod) < 0) {
			modules.push(mod);
			console.log(mod);
			var check = function(mod) {
			db.collection('syncrolls').count({'CourseCode': mod}).then(function(data) {
				if (data == 0) {
				var entry = {'CourseCode': mod, 'CreatedBy': 'IVLE'};
				db.collection('syncrolls').save(entry, function(err, result) {
					if (err) return console.log(err);
					console.log('Saved to database');
					});
				}
				});
			};
			check(mod);
			}
			}
			// Add new user
			db.collection('users').count({'UserID': userID}).then(function(data) {
					if (data == 0) {
					var entry = {'UserID': userID, 'syncrolls': modules};
					db.collection('users').save(entry, function(err, result) {
						if (err) return console.log(err);
						console.log('Created new user');
						});
					} else {
					// Update user syncrolls with ivle module list ---- save for another day.
					/*
					   modules.forEach(function(mod) {
					   db.collection('users').findOne({'UserID': userID}).then(function(data) {
					   if (data['syncrolls'].indexOf(mod) < 0) {
					   95
					   }
					   });
					   });
					}
					});
			res.send(modules);
		});
	});
});
*/

module.exports = tasks;
