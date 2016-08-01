var exports;
var request = require('request');

var userid, username, token;

var apiKey = 'rSe7yZUlJVbjo95tnZs4i';

exports.requireUserID = function(req, res, next) {
	token = req.query.token;
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

module.exports = exports;
