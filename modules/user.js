var exports;
var request = require('request');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://0.0.0.0:8888", neo4j.auth.basic("neo4j", "1"));

var apiKey = 'rSe7yZUlJVbjo95tnZs4i';

exports.requireUserID = function(req, res, next) {
	var token = req.query.token;
	//console.log('Token: ' + token);
	var userID_get = 'https://ivle.nus.edu.sg/api/Lapi.svc/UserID_Get?APIKey=' + apiKey + '&Token=' + token;
	request(userID_get, function(error, response, body) {
		userid = JSON.parse(body);
		if (!userid) res.sendStatus(400); // need to handle error
		else {
			req.userid = userid;
			next();
		}
	});
};

exports.createNewUser = function(req, res, next) {
	var userid = req.userid;
	var token = req.query.token;
	var session = driver.session();
	var userName_get = 'https://ivle.nus.edu.sg/api/Lapi.svc/UserName_Get?APIKey=' + apiKey + '&Token=' + token;
	request(userName_get, function(error, response, body) {
		userName = JSON.parse(body);
		session.run('CREATE (s:Student {userID:{id}, userName:{name}})', {id: userid, name: userName}).then(function() {
			next();
		});
	});
};

module.exports = exports;
