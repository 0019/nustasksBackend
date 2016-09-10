var request = require('request');
var expect = require('chai').expect;
var app = require('../app.js');

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			expect(-1).to.equal([1,2,3].indexOf(4));
		});
	});
});

describe('User login', function() {
	describe('New user creation', function() {
	
	});
	describe('User validation', function() {
	});
});
