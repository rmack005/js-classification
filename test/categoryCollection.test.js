/* jshint node: true, esversion: 6, mocha:true */
"use strict";

const expect = require('chai').expect;
const categoryCollectionFactory = require('../lib/categoryCollection.js');

describe('categoryCollection',function() {
	const collection = categoryCollectionFactory();
	
	describe('incrementCategoryCount',function() {	
		collection.incrementCategoryCount("c1", 3);
		collection.incrementCategoryCount("c1", 1);
		const count = collection.getCategoryCount("c1");
		
		it('should increment the category count', function() {
			expect(count).to.equal(4);
		});
	});
	
	describe('toArray',function() {	
		collection.incrementCategoryCount("c1", 1);
		collection.incrementCategoryCount("c2", 1);
		collection.incrementCategoryCount("c2", 2);
		collection.incrementCategoryCount("c2", 2);
		
		const array = collection.toArray();
		
		it('should return all the category counts', function() {
			expect(array).to.have.length(2);
		});
	});
	
	describe('sumAllCategoryCounts',function() {		
		const sum = collection.sumAllCategoryCounts();
		
		it('should return the sum of all the category counts', function() {
			expect(sum).to.equal(10);
		});
	});
});