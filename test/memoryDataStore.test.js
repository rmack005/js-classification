"use strict";

var _ = require('lodash');
var expect = require('chai').expect;
var memoryDataStore = require('../lib/memoryDataStore');

describe('memoryDataStore',function() {
	describe('getFeatureCounts',function() {
		var dataStore = memoryDataStore.create();
		var category = "cat";
		var features = [{feature: "feature1", count: 1}, {feature: "feature2", count: 1}];
		
		dataStore.incrementFeatureCounts(category, features);
		var collection = dataStore.getFeatureCounts(_.map(features, function(item) {
				return item.feature;
		}));
		
		it('should return an object with the expected properties', function() {
			expect(collection).to.have.property('incrementFeatureCount');
			expect(collection).to.have.property('getFeatureCount');
			expect(collection).to.have.property('toArray');
		});
		
		it('should return the correct feature count', function() {
			var result = collection.getFeatureCount("feature1", category);
			expect(result).to.equal(1);
		});
	});
	
	describe('getCategoryCounts',function() {
		var dataStore = memoryDataStore.create();
		var category = "cat";
		
		dataStore.incrementCategoryCount(category);
		var collection = dataStore.getCategoryCounts();
		
		it('should return an object with the expected properties', function() {
			expect(collection).to.have.property('incrementCategoryCount');
			expect(collection).to.have.property('getCategoryCount');
			expect(collection).to.have.property('toArray');
			expect(collection).to.have.property('sumAllCategoryCounts');
		});
			
		it('should return the correct counts', function() {
			var count = collection.getCategoryCount(category);
			expect(count).to.equal(1);			
		});
	});
});