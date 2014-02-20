"use strict";

var expect = require('chai').expect;
var featureCollection = require('../lib/featureCollection.js');

describe('featureCollection',function() {
	var collection = featureCollection.create();
	
	describe('incrementFeatureCount',function() {	
		collection.incrementFeatureCount("f1", "c1", 3);
		collection.incrementFeatureCount("f1", "c1", 1);
		var count = collection.getFeatureCount("f1", "c1");
		
		it('should increment the feature count', function() {
			expect(count).to.equal(4);
		});
	});
	
	describe('toArray()',function() {	
		collection.incrementFeatureCount("f2", "c1", 1);
		collection.incrementFeatureCount("f1", "c2", 1);
		collection.incrementFeatureCount("f3", "c2", 2);
		collection.incrementFeatureCount("f5", "c2", 2);
		
		var arrayC1 = collection.toArray("c1");
		var arrayC2 = collection.toArray("c2");
		
		it('should return all the feature counts for a given category', function() {
			expect(arrayC1).to.have.length(2);
			expect(arrayC2).to.have.length(3);
		});
	});
});