var express = require('express');
var Rolls = require('../modules/rolls');
var rolls = express.Router();

/* GET users listing. */
rolls.get('/', Rolls.refresh);

//rolls.get('/getRoll', Rolls.getRoll);

//rolls.get('/addRoll', Rolls.addRoll);

module.exports = rolls;
