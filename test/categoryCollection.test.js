"use strict";

var expect = require('chai').expect;
var categoryCollection = require('../lib/categoryCollection.js');

describe('categoryCollection',function() {
	var collection = categoryCollection.create();
	
	describe('incrementCategoryCount',function() {	
		collection.incrementCategoryCount("c1", 3);
		collection.incrementCategoryCount("c1", 1);
		var count = collection.getCategoryCount("c1");
		
		it('should increment the category count', function() {
			expect(count).to.equal(4);
		});
	});
	
	describe('toArray',function() {	
		collection.incrementCategoryCount("c1", 1);
		collection.incrementCategoryCount("c2", 1);
		collection.incrementCategoryCount("c2", 2);
		collection.incrementCategoryCount("c2", 2);
		
		var array = collection.toArray();
		
		it('should return all the category counts', function() {
			expect(array).to.have.length(2);
		});
	});
	
	describe('sumAllCategoryCounts',function() {		
		var sum = collection.sumAllCategoryCounts();
		
		it('should return the sum of all the category counts', function() {
			expect(sum).to.equal(10);
		});
	});
});