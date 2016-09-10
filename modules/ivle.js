var neo4j = require('neo4j-driver').v1;
var exports;
var async = require('async');
var request = require('request');
var apiKey = 'rSe7yZUlJVbjo95tnZs4i';

var driver = neo4j.driver("bolt://localhost:8888", neo4j.auth.basic("neo4j", "1"));

exports.syncModules = function(req, res, next) {
	var userid = req.userid;
	var token = req.query.token;
	var modules_Student = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + apiKey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false&output=json';
	
	var calls = [];
	var modules = [];
	request(modules_Student, function(error, response, body) {
		var modulesData = JSON.parse(body);
		modulesData['Results'].forEach(function(module) {
			//console.log("Module " + module + " added.");
			var mod = module['CourseCode'];
			var sem = module['CourseSemester'];
			sem = sem.charAt(sem.length - 1);
			var year = module['CourseAcadYear'];
			calls.push(function() {
				var session = driver.session();
				console.log("Module " + mod + " added.");
				session.run('CREATE (m:Module {CourseCode: {code}})', {code: mod});
				session.run('MATCH (s:Student {userID: {id}}) ' +
							'MATCH (m:Module {CourseCode: {code}}) ' +
							'CREATE (s)-[:learnt {time: {ay}}]->(m)', {id: userid, code: mod, ay: year+'_'+sem});
			});
		
		});
		async.parallel(calls);
		next();
	});
};

/*
exports.syncIVLE = function(req, res, next) {
	var token = req.query.token;
	var userid = req.userid;
	var db = req.db;
	var modules = [];
	var modules_student = 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules_Student?APIKey=' + apiKey + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false&output=json';
	request(modules_student, function(error, response, body) {
		var json = JSON.parse(body);
		for (var key in json['Results']) {
			var mod = json['Results'][key]['CourseCode'];
			
			session.run( "MERGE (:Module {code:{mod}})", {mod: mod});

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
		var colors = ['#F06060', '#F3B562', '#F2EBBF', '#8CBEB2', '#5C4B51', '#7F1637', '#047878', '#FFB733', '#F57336', '#C22121'];
		var modulesAndColors = [];
		for (var i = 0; i < modules.length; i++) {
			modulesAndColors.push([modules[i], colors[i%10]]);
		}
		var newUser = {'UserID': userid, 
					   'syncrolls': modulesAndColors};
		db.collection('users').save(newUser, function(err, result) {
			//res.redirect('/tasks/?token=' + token);
			next();
		});
	});
};
*/
module.exports = exports;
