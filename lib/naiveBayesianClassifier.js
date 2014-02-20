"use strict";

var memoryDataStore = require('./memoryDataStore.js');
var featureExtraction = require('./featureExtraction.js');
var featureCollection = require('./featureCollection.js');
var _ = require('lodash');

var ClassificationError = function(message){
	this.message = message;
};

ClassificationError.prototype.toString = function() {
	return this.message;
}

exports.ClassificationError = ClassificationError;

var defaults = {
	dataStoreFactory: memoryDataStore.create,
	featureExtractor: featureExtraction.whiteSpaceFeatureExtractor,
	threshold: 1,
	featureSetSize: 50
};

var computeProbability = function(documentCount, category, categoryCount, features, featureCounts, settings){
	if (categoryCount == 0) {
			return .5;
	}
	
	var categoryProbability = categoryCount / documentCount;
	
	var documentProbability = _(features)
		//  Compute and cap the probability of each feature
		.map(function(feature){
			return Math.max(Math.min(computeFeatureProbability(category, categoryCount, feature, featureCounts), .999), .001);
		})
		//  Order by most interesting to least interesting
		.sortBy(function(probability){
			return Math.abs(.5 - probability)
		})
		//  Keep only the n most interesting
		.first(settings.featureSetSize)
		//  Compute the document probability using what's left
		.reduce(function(memo, value){ 
			return memo * value; 
		});
	
	return documentProbability * categoryProbability;
};

var computeFeatureProbability = function(category, categoryCount, feature, featureCounts){
	var featureCount = featureCounts.getFeatureCount(feature, category);
	return (categoryCount == 0) ? 0 : featureCount / categoryCount;
};

var classifyDocument = function(document, dataStore, settings) {
	if(document === null) {
		throw new ClassificationError("A document must be provided");
	}
	
	var features = settings.featureExtractor(document);
	var categoryCounts = dataStore.getCategoryCounts();
	var featureCounts = dataStore.getFeatureCounts(features);
	var documentCount = categoryCounts.sumAllCategoryCounts();
	
	var bestTwoCategories = _(categoryCounts.toArray())
		.map(function(item){
			return {
				categoryData: item, 
				probability: computeProbability(documentCount, item.category, item.count, features, featureCounts, settings)
			};
		})
		.sortBy(function(item){return Math.abs(item.probability - 1)})
		.first(2)
		.value();
		
	if (bestTwoCategories.length == 0) return null;
	if ((bestTwoCategories.length == 1) && (settings.threshold == 1)) return bestTwoCategories[0].categoryData.category;
	
	return (bestTwoCategories[0].probability >= (bestTwoCategories[1].probability*settings.threshold)) 
		? bestTwoCategories[0].categoryData.category 
		: null;
};

var trainDocument = function(category, document, dataStore, settings) {
	if(!category) {
		throw new ClassificationError("A category must be provided");
	}
	
	if(document === null) {
		throw new ClassificationError("A document must be provided");
	}
	
	var features = settings.featureExtractor(document);
	var collection = featureCollection.create();
	
	_(features).forEach(function(feature){
		collection.incrementFeatureCount(feature, category, 1);
	});
	
	dataStore.incrementFeatureCounts(category, collection.toArray(category));
	dataStore.incrementCategoryCount(category);
};

exports.create = function(options){
	var settings = defaults.merge(options || {});
	var dataStore = settings.dataStoreFactory();
	
	var classifier = {
		classify: function(document) {
			return classifyDocument(document, dataStore, settings);
		},
		
		train: function(category, document) {
			trainDocument(category, document, dataStore, settings);
		}
	}
	
	return classifier;
};