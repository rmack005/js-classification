"use strict";

var expect = require('chai').expect;
require('../lib/extensions');

describe('Extensions',function() { 
	describe('String.interpolate',function() { 
		it('should be a defined function', function() {
			expect("".interpolate).to.be.a('function');
		});
			
		describe('interpolation via an object',function() { 
			var result = "This is a {{test}}.".interpolate({"test": "successful test"});

			it('should produce a string', function() {
				expect(result).to.be.a('string');
			});
			
			it('should produce the expected string', function() {
				expect(result).to.equal('This is a successful test.');
			});
		});

		describe('interpolation via an array',function() { 
			var result = "This is a {{0}} {{1}}.".interpolate(["successful", "test"]);

			it('should produce a string', function() {
				expect(result).to.be.a('string');
			});
			
			it('should produce the expected string', function() {
				expect(result).to.equal('This is a successful test.');
			});
		});

		describe('interpolation of a nonexistent property',function() { 
			var result = "This is a {{nonexistent}}.".interpolate({"test": "successful test"});

			it('should produce a string', function() {
				expect(result).to.be.a('string');
			});
			
			it('should produce the expected string', function() {
				expect(result).to.equal('This is a {{nonexistent}}.');
			});
		});

		describe('interpolation of a nonexistent index',function() { 
			var result = "This is a {{0}} {{4}}.".interpolate(["successful", "test"]);

			it('should produce a string', function() {
				expect(result).to.be.a('string');
			});
			
			it('should produce the expected string', function() {
				expect(result).to.equal('This is a successful {{4}}.');
			});
		});
	});

	describe('Array.binarySearch',function() {
		it('should be a defined function', function() {
			expect([].binarySearch).to.be.a('function');
		});
		
		describe('a search for an item not in the array', function(){
			var result = [1,2,3,7,14].binarySearch(5);
			
			it('should return the bitwise complement of the index of the next element that is larger than item.', function(){
				expect(result).to.equal(~3);
			});
		});

		describe('a search for an item larger than all items in the array', function(){
			var result = [1,2,3,7,14,22].binarySearch(78);
			
			it('should return the bitwise complement of length of the array.', function(){
				expect(result).to.equal(~6);
			});
		});

		describe('a search for an item in the array', function(){
			var result = [1,2,3,4,5,6,7,8,9].binarySearch(3);
			
			it('should return the index of the item in the array', function(){
				expect(result).to.equal(2);
			});
		});
	});
	
	describe('Object.merge',function() {
		it('should be a defined function', function() {
			expect({}.merge).to.be.a('function');
		});
		
		describe('calling with zero arguments', function(){
			var test = {prop: "value"};
			var result = test.merge();
			
			it('should return a copy of the object.', function(){
				expect(result).to.eql(test);
			});
		});

		describe('calling with one or more arguments', function(){
			var arg1 = {
				option1: "option1",
				option2: "option2",
				option3: {
					foo: "test"
				}
			};
			
			var arg2 = {
				option2: "option20",
				option3: {
					bar: "test"
				}
			};
			
			var arg3 = {
				option4: "option4"
			};
			
			var result = arg1.merge(arg2, arg3);
			
			it('should return an object that merges the object and arguments into one object', function(){
				expect(result).to.have.property("option1", "option1");
				expect(result).to.have.property("option2", "option20");
				expect(result).to.have.property("option3");
				expect(result.option3).to.have.property("foo", "test");
				expect(result.option3).to.have.property("bar", "test");
				expect(result).to.have.property("option4", "option4");
			});
		});
	});
});