var express = require('express');
var Rolls = require('../modules/rolls');
var rolls = express.Router();
var User = require('../modules/user');

/* GET users listing. */
rolls.get('/', User.requireUserID, Rolls.refresh);

//rolls.get('/getRoll', Rolls.getRoll);

//rolls.get('/addRoll', Rolls.addRoll);

module.exports = rolls;
