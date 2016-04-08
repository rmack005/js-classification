/* jshint node: true, esversion: 6, mocha:true */
"use strict";

const _ = require('lodash');
const expect = require('chai').expect;
const memoryDataStoreFactory = require('../lib/memoryDataStore');

describe('memoryDataStore',function() {
	describe('getFeatureCounts',function() {
		const dataStore = memoryDataStoreFactory();
		const category = "cat";
		const features = [{feature: "feature1", count: 1}, {feature: "feature2", count: 1}];
		
		dataStore.incrementFeatureCounts(category, features);
		const collection = dataStore.getFeatureCounts(_.map(features, function(item) {
				return item.feature;
		}));
		
		it('should return an object with the expected properties', function() {
			expect(collection).to.have.property('incrementFeatureCount');
			expect(collection).to.have.property('getFeatureCount');
			expect(collection).to.have.property('toArray');
		});
		
		it('should return the correct feature count', function() {
			const result = collection.getFeatureCount("feature1", category);
			expect(result).to.equal(1);
		});
	});
	
	describe('getCategoryCounts',function() {
		const dataStore = memoryDataStoreFactory();
		const category = "cat";
		
		dataStore.incrementCategoryCount(category);
		const collection = dataStore.getCategoryCounts();
		
		it('should return an object with the expected properties', function() {
			expect(collection).to.have.property('incrementCategoryCount');
			expect(collection).to.have.property('getCategoryCount');
			expect(collection).to.have.property('toArray');
			expect(collection).to.have.property('sumAllCategoryCounts');
		});
			
		it('should return the correct counts', function() {
			const count = collection.getCategoryCount(category);
			expect(count).to.equal(1);			
		});
	});
});