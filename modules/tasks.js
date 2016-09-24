var exports;
var async = require('async');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://0.0.0.0:8888", neo4j.auth.basic("neo4j", "1"));

var User = require('./user');
var IVLE = require('./ivle');

exports.refresh = function(req, res, next) {
	var userid = req.userid;
	var session = driver.session();
	var numOfUserFound = 0;
	async.series([
		function(callback) {
			session
				.run( "MATCH (a:Student {userID:{id}}) return a.name", {id: userid})
				.subscribe({
					onNext: function(record) {
						numOfUserFound++;
					},
					onCompleted: function() {
						if (numOfUserFound == 0) {
							session.close();
							next();
						} else callback();
					},
					onError: function(error) {
						console.log(error);
					}
				});
		}
	], function() {
			// search for tasks and return
			var tasks = [];
			session
				.run( "MATCH (a:Student {userID:{id}})-[]->(m:Module)-[]->(di:ModuleInfo)-[]->(t:Task) return t.CourseCode as code, t.Title as title, t.Deadline as ddl",{id: userid} )
				.subscribe({
					onNext: function(record) {
						var task = {"title": record.get("title"), "code": record.get("code"), "deadline": record.get("ddl")};
						tasks.push(task);
					},
					onCompleted: function() {
						session.close();
						res.send(tasks);
					},
					onError: function(error) {
						console.log("Retrieving tasks error: " + error);
						session.close();
						res.send();
					}
				});
		}
	);
};

exports.addTask = function(req, res) {
	var contents = decodeURI(req.query.contents);
	var roll = decodeURI(req.query.roll);
	var title = decodeURI(req.query.title);
	var duetime = decodeURI(req.query.duetime);
	console.log('Title: ' + title);
	console.log('Roll: ' + roll);
	console.log('Contents: ' + contents);
	console.log('Due: ' + duetime);
	
	var session = driver.session();
	
	var numOfSameNameTasks = 0;
	session.run('MATCH (t:Task {title:{title}, course:{course}}) return t.title', {title: title, course: roll})
		   .subscribe({
			   	onNext: function(record) {
						numOfSameNameTasks++;
					},
			   	onCompleted: function() {
					if (numOfSameNameTasks == 0) {
						//async.series([
							//function(callback) {
								session.run('CREATE (t:Task {Title:{title}, CourseCode:{course}, Deadline:{ddl}, Details:{details}, CreatorID:{id}}) WITH t ' +
											'MATCH (:Student {userID:{id}})-[r:learnt]->(m:Module {CourseCode:{course}}) WITH t, r.time as time, m ' +
											'MATCH (m)-[:at{time:time}]->(mi:ModuleInfo) WITH t, mi ' +
											'CREATE (mi)-[:has]->(t)',
											{title: title, course: roll, ddl: duetime, id: req.userid, details:contents})
										.then(function() {
											console.log("Task added");
											res.send(JSON.stringify('done'));
										});
								//callback();
							//},
							//function(callback) {
								//session.run('CREATE (t:Task {Title:{title}, CourseCode:{course}, Deadline:{ddl}, Details:{details}, CreatorID:{id}})', 
								//			{title: title, course: roll, ddl: duetime, id: req.userid, details:contents});
								//callback();
							//}
						//], function(err, results) {
						//});
					} else {
						console.log("Task duplicated");
						res.send(JSON.stringify('duplicate'));
						console.log(details);
					}
			   	},
			   	onError: function(error) {
			   		console.log(error);
				}
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
