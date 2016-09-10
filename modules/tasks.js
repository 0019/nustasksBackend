var exports;
var async = require('async');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://0.0.0.0:8888", neo4j.auth.basic("neo4j", "1"));

var User = require('./user');
var IVLE = require('./ivle');

exports.refresh = function(req, res, next) {
	var userid = req.userid;
	var session = driver.session();
	session
		//.run( "MATCH (a:Student {userID:{id}} return a.name,a.userID)",{id:userid})
		.run( "MATCH (a:Student {userID:{id}}) return a.name", {id: userid})
		.then(function(result) {
			if (result.length == 1) {
				console.log("Success: Found one student");
				res.send();
			} else {
				next(); // -> IVLE Sync -> Tasks refresh again
			}
		});
		/*
    	.then(function (result) {
		    var records = [];
			    for (i = 0; i < result.records.length; i++) {
					      records.push(result.records[i]);
						      }
							      return records;
								    })
	  	.then(function (records) {
			if (records.length == 0)
				session.run('CREATE (a.Module {code:"uiui"})');
			else 
				session.run('CREATE (a.Module {code:"else"})');
	});
		*/
	/*
	db.collection('users').find({'UserID': userid}, {'syncrolls': 1}).limit(1).toArray(function(err, result) {
		if (err) return console.log(err);
		if (result.length != 0) { // not new user
			var tasksByRolls = [];
			var calls = [];
			result[0].syncrolls.forEach(function(roll) {
				calls.push(function(callback) {
					console.log(roll);
					var color = roll[1];
					db.collection('tasks').find({'Syncroll': roll[0]}, {'Title': 1, 'Duedate': 1, 'Duetime': 1, 'Syncroll': 1}).toArray(function(err, result) {
						if (result.length > 0) tasksByRolls.push([result, color]);
						console.log(roll + ' pushed');
						callback(null, roll);
					});
				});
			});
			async.parallel(calls, function(err, result) {
				res.send(tasksByRolls);
			});
		} else {
			next();
		}
	});
	*/
};

exports.addTask = function(req, res) {
	var contents = decodeURI(req.query.contents);
	var roll = decodeURI(req.query.roll);
	var title = decodeURI(req.query.title);
	var duedate = decodeURI(req.query.duedate);
	var duetime = decodeURI(req.query.duetime);
	console.log('Title: ' + title);
	console.log('Roll: ' + roll);
	console.log('Contents: ' + contents);
	console.log('Due: ' + duedate + ' ' + duetime);
	
	var entry = {'Title': title, 'Contents': contents, 'Duedate': duedate, 'Duetime': duetime, 'Syncroll': roll, 'CreatedBy': req.userid};
	req.db.collection('tasks').save(entry, function(err, result) {
		console.log('Task ' + title + ' added.');
		res.send(JSON.stringify('done'));
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
		console.log('Task ' + title + ' updated')
		res.redirect('/tasks/getTask/?id=' + id + 'token=' + req.query.token);
	});
};

module.exports = exports;
