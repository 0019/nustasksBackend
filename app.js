var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
var MongoClient = require('mongodb').MongoClient;

var tasks = require('./routes/tasks');
var rolls = require('./routes/rolls');

//var User = require('./modules/user');
var port = 3000;
var db;

var app = express();
MongoClient.connect('mongodb://nustasksAdmin:bhmgdbnustasks@ds051334.mlab.com:51334/nustasks', function(err, database) {
	if (err) return console.log(err);
	db = database;
	app.listen(port, () => {
		console.log('alive: ' + port);
	});
});

//app.use('/tasks', User.init);
//app.use('/rolls', User.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.all('*', function(req, res, next) {
	req.db = db;
	next();
});

app.use('/tasks', tasks);
app.use('/rolls', rolls);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
